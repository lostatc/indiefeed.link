export const htmlToText = (html: string): string | undefined =>
  new DOMParser().parseFromString(html, "text/html").documentElement.textContent ?? undefined;

// We might make this more sophisticated later, maybe splitting on word boundaries instead.
export const truncateText = (text: string, length: number): string =>
  text.slice(0, length) + "\u2026";

export const truncateArticleText = (text: string): string => text.slice(0, 350) + "\u2026";
