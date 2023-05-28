export const htmlToText = (html: string): string | undefined =>
  new DOMParser().parseFromString(html, "text/html").documentElement.textContent ?? undefined;
