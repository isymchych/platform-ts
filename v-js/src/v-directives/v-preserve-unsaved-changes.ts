import { registerVDirective } from '../v-js';
import { formDataToObject } from '../forms';

function isEqualFormData(fd1: FormData, fd2: FormData): boolean {
  const fd1Obj = formDataToObject(fd1);
  const fd2Obj = formDataToObject(fd2);

  return JSON.stringify(fd1Obj) === JSON.stringify(fd2Obj);
}

function preserveUnsavedChanges(form: HTMLFormElement): void {
  let submitted = false;
  const initialFormData = new FormData(form);

  function onBeforeUnload(event: BeforeUnloadEvent) {
    const fd = new FormData(form);

    if (submitted) {
      return;
    }

    if (isEqualFormData(initialFormData, fd)) {
      return;
    }

    event.preventDefault();

    return (event.returnValue = 'Page has unsaved changes. Are you sure you want to exit?');
  }

  window.addEventListener('beforeunload', onBeforeUnload, { capture: true });

  form.addEventListener('submit', () => {
    submitted = true;
  });
}

registerVDirective('v-preserve-unsaved-changes', (el) => {
  if (!(el instanceof HTMLFormElement)) {
    throw new Error('v-preserve-unsaved-changes must be applied to form');
  }

  preserveUnsavedChanges(el);
});
