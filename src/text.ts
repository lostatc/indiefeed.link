export const htmlToText = (html: string): string | undefined =>
  new DOMParser().parseFromString(html, "text/html").documentElement.textContent ?? undefined;

// We might make this more sophisticated later, maybe splitting on word boundaries instead.
export const truncateText = (text: string, length: number): string => {
  const truncated = text.slice(0, length);

  if (truncated.length < length) return truncated;

  // We trimEnd() in case the truncated text was cut off after some whitespace, to avoid an ugly
  // space between the last character and the ellipsis.
  return truncated.trimEnd() + "\u2026";
};

export const truncateArticleSummary = (text: string): string => truncateText(text, 350);
