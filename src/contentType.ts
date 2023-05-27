import contentType from "content-type";

export const ContentType = {
  Atom: "application/atom+xml",
  Rss: "application/rss+xml",
  Xml: "application/xml",
  Html: "text/html",
} as const;

export const hasOneOfContentTypes = (
  res: Response,
  contentTypes: ReadonlyArray<string>
): boolean => {
  const contentTypeHeader = res.headers.get("Content-Type");
  if (contentTypeHeader === null) return false;

  const parsedContentType = contentType.parse(contentTypeHeader).type;
  return contentTypes.includes(parsedContentType);
};

export const isHtmlPage = (res: Response): boolean => hasOneOfContentTypes(res, [ContentType.Html]);
