import { useEffect, useState } from "react";
import { ContentType, hasOneOfContentTypes, isHtmlPage } from "../contentType";
import { AtomFeed } from "./AtomFeed";
import { RssFeed } from "./RssFeed";

type FeedKind = "atom" | "rss";

const contentTypeForFeed = (kind: FeedKind): string => {
  switch (kind) {
    case "atom":
      return ContentType.Atom;
    case "rss":
      return ContentType.Rss;
  }
};

const getFeedKind = (res: Response): FeedKind | undefined => {
  if (hasOneOfContentTypes(res, [contentTypeForFeed("atom")])) {
    return "atom";
  } else if (hasOneOfContentTypes(res, [contentTypeForFeed("rss")])) {
    return "rss";
  } else {
    return undefined;
  }
};

interface FeedUrl {
  kind: FeedKind;
  url: string;
}

const getFeedUrlFromDocument = (doc: Document, kind: FeedKind): FeedUrl | undefined => {
  const feedLinkElement = doc.querySelector(
    `html > head > link[rel="alternate"][type="${contentTypeForFeed(kind)}"]`
  );
  if (feedLinkElement === null) return undefined;

  const feedUrl = feedLinkElement.getAttribute("href") ?? undefined;
  if (feedUrl === undefined) return undefined;

  return {
    kind,
    url: feedUrl,
  };
};

// We prefer Atom feeds to RSS feeds.
const getBestFeedUrlFromDocument = (doc: Document): FeedUrl | undefined =>
  getFeedUrlFromDocument(doc, "atom") ?? getFeedUrlFromDocument(doc, "rss");

interface Feed {
  kind: FeedKind;
  doc: XMLDocument;
}

const getFeed = async (res: Response): Promise<Feed | undefined> => {
  const feedKind = getFeedKind(res);
  if (feedKind !== undefined)
    return {
      kind: feedKind,
      doc: new DOMParser().parseFromString(await res.text(), ContentType.Xml),
    };

  if (!isHtmlPage(res)) return undefined;

  const htmlDoc = new DOMParser().parseFromString(await res.text(), ContentType.Html);

  const feedUrl = getBestFeedUrlFromDocument(htmlDoc);
  if (feedUrl === undefined) return undefined;

  const feedRes = await fetch(feedUrl.url);

  return {
    kind: feedUrl.kind,
    doc: new DOMParser().parseFromString(await feedRes.text(), ContentType.Xml),
  };
};

export const SyndicationFeed = ({ url }: { url: string }) => {
  const [feed, setFeed] = useState<Feed>();

  useEffect(() => {
    fetch(url)
      .then((res) => getFeed(res))
      .then((rawFeed) => setFeed(rawFeed));
  }, [url]);

  if (feed === undefined) return <></>;

  switch (feed.kind) {
    case "atom":
      return <AtomFeed feedDoc={feed.doc} />;
    case "rss":
      return <RssFeed feedDoc={feed.doc} />;
  }
};
