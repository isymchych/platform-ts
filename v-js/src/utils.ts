export type Callback = () => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

export const sum = (a: number, b: number) => a + b;

export async function fetchText(
  url: string,
  body?: XMLHttpRequestBodyInit,
  headers?: HeadersInit
): Promise<string> {
  try {
    const response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers,
      body,
    });

    const message = await response.text();

    if (!response.ok) {
      throw new Error(`failed to fetch text: ${response.status}\n${message}`);
    }

    return message;
  } catch (e) {
    console.error(e);
    alert(e);

    throw e;
  }
}
