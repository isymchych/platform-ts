import A11yDialog from 'a11y-dialog';
import { Callback, fetchText, noop } from './utils';

const CLOSE_MODAL_EVENT = 'close-modal';

function renderModal(modalContent: string): void {
  const rootEl = document.getElementById('modal-root');
  if (!rootEl) {
    throw new Error('modal root el not found');
  }

  const modalEl = document.createElement('div');
  modalEl.dataset.modal = ''; // marker attribute [data-modal]
  modalEl.innerHTML = modalContent;

  rootEl.appendChild(modalEl);

  const modal = new A11yDialog(modalEl);

  let unlockScroll = noop;
  modal.on('show', () => {
    unlockScroll = lockGlobalScroll();
  });

  modal.on('hide', () => {
    unlockScroll();

    modalEl.remove();
  });

  rootEl.addEventListener(CLOSE_MODAL_EVENT, () => {
    modal.hide();
  });

  modal.show();
}

function lockGlobalScroll(): Callback {
  const documentEl = document.documentElement;
  const originalStyle = documentEl.style.cssText;
  const scrollTop = documentEl.scrollTop;

  // preserve scroll position and hide scroll
  documentEl.style.cssText = `position: fixed; left: 0; right: 0; overflow: hidden; top: -${scrollTop}px`;

  return () => {
    // restore scroll position
    documentEl.style.cssText = originalStyle;
    documentEl.scrollTop = scrollTop;
  };
}

export async function showModal(url: string): Promise<void> {
  const content = await fetchText(url);

  renderModal(content);
}

export function dispatchCloseModalEvent(modalChild: Element): void {
  const event = new CustomEvent(CLOSE_MODAL_EVENT, {
    bubbles: true,
  });

  modalChild.dispatchEvent(event);
}

export function getModalContainer(modalChild: HTMLElement): HTMLElement {
  const result = modalChild.closest('[data-modal]');

  if (!result) {
    throw new Error('cannot find modal element');
  }

  return result as HTMLElement;
}

export function scrollModalToTop(modalChild: HTMLElement): void {
  getModalContainer(modalChild).scrollTop = 0;
}
