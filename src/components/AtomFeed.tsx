import { useEffect, useState } from "react";
import contentType from "content-type";

const ContentType = {
  Atom: "application/atom+xml",
  Xml: "application/xml",
  Html: "text/html",
} as const;

const hasOneOfContentTypes = (res: Response, contentTypes: ReadonlyArray<string>): boolean => {
  const contentTypeHeader = res.headers.get("Content-Type");
  if (contentTypeHeader === null) return false;

  const parsedContentType = contentType.parse(contentTypeHeader).type;
  return contentTypes.includes(parsedContentType);
};

const isAtomFeed = (res: Response): boolean => hasOneOfContentTypes(res, [ContentType.Atom]);

const isHtmlPage = (res: Response): boolean => hasOneOfContentTypes(res, [ContentType.Html]);

const getAtomFeedUrlFromDocument = (doc: Document): URL | undefined => {
  const feedLinkElement = doc.querySelector(
    `html > head > link[rel="alternate"][type="${ContentType.Atom}"]`
  );
  if (feedLinkElement === null) return undefined;

  const feedUrl = feedLinkElement.getAttribute("href");
  if (feedUrl === null) return undefined;

  return new URL(feedUrl);
};

const getAtomFeed = async (res: Response): Promise<XMLDocument | undefined> => {
  if (isAtomFeed(res)) return new DOMParser().parseFromString(await res.text(), ContentType.Xml);

  if (!isHtmlPage(res)) return undefined;

  const htmlDoc = new DOMParser().parseFromString(await res.text(), ContentType.Html);

  const atomFeedUrl = getAtomFeedUrlFromDocument(htmlDoc);
  if (atomFeedUrl === undefined) return undefined;

  const atomFeedRes = await fetch(atomFeedUrl);
  return new DOMParser().parseFromString(await atomFeedRes.text(), ContentType.Xml);
};

export const AtomFeed = ({ url }: { url: URL }) => {
  const [atomFeedDoc, setAtomFeedDoc] = useState<XMLDocument>();

  useEffect(() => {
    fetch(url)
      .then((res) => getAtomFeed(res))
      .then((atomFeed) => setAtomFeedDoc(atomFeed));
  }, [url]);
};
