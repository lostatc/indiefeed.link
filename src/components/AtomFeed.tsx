import { useEffect, useMemo, useState } from "react";
import contentType from "content-type";
import { FeedArticle, FeedArticleProps } from "./FeedArticle";
import { Feed } from "./Feed";

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

const getAtomFeedUrlFromDocument = (doc: Document): string | undefined => {
  const feedLinkElement = doc.querySelector(
    `html > head > link[rel="alternate"][type="${ContentType.Atom}"]`
  );
  if (feedLinkElement === null) return undefined;

  return feedLinkElement.getAttribute("href") ?? undefined;
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

const parseAtomFeed = (doc: XMLDocument): ReadonlyArray<FeedArticleProps> => {
  // The author to use if individual entries don't have authors.
  const fallbackAuthor = doc.querySelector("feed > author > name")?.textContent ?? undefined;

  // The URL to use if individual entries (for some reason) don't have URLs.
  const fallbackUrl =
    doc.querySelector(`feed > link[rel="alternate"][type="text/html"]`)?.getAttribute("href") ??
    undefined;

  const entries = doc.querySelectorAll("feed > entry");

  return Array.from(entries).map((entry) => ({
    url:
      entry.querySelector(`link[rel="alternate"][type="text/html"]`)?.getAttribute("href") ??
      fallbackUrl ??
      "",
    title: entry.querySelector("title")?.textContent ?? "",
    subtitle: entry.querySelector("summary")?.textContent ?? undefined,
    categories: Array.from(entry.querySelectorAll("category")).map(
      (category) => category.getAttribute("label") ?? category.getAttribute("term") ?? ""
    ),
    date: new Date(
      entry.querySelector("published")?.textContent ??
        entry.querySelector("updated")?.textContent ??
        ""
    ),
    authorName: entry.querySelector("author > name")?.textContent ?? fallbackAuthor,
  }));
};

export const AtomFeed = ({ url }: { url: string }) => {
  const [atomFeedDoc, setAtomFeedDoc] = useState<XMLDocument>();
  const [atomFeed, setAtomFeed] = useState<ReadonlyArray<FeedArticleProps>>();

  useEffect(() => {
    fetch(url)
      .then((res) => getAtomFeed(res))
      .then((atomFeed) => setAtomFeedDoc(atomFeed));
  }, [url]);

  useMemo(() => {
    if (atomFeedDoc === undefined) return;
    setAtomFeed(parseAtomFeed(atomFeedDoc));
  }, [atomFeedDoc]);

  return <Feed>{atomFeed?.map((articleProps) => FeedArticle(articleProps)) ?? []}</Feed>;
};
