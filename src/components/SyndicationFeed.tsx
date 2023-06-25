import { useEffect, useState } from "react";
import { AtomFeed } from "./AtomFeed";
import { RssFeed } from "./RssFeed";
import contentType from "content-type";
import { FeedNotFound } from "./FeedNotFound";
import { Feed } from "./Feed";

// The serverless function will serve syndication feeds with one of these content types.
export const ContentType = {
  Atom: "application/atom+xml",
  Rss: "application/rss+xml",
  Xml: "application/xml",
} as const;

type FeedKind = "atom" | "rss";

interface Feed {
  kind: FeedKind;
  body: XMLDocument;
}

const probeIsAtomFeed = (feedBody: XMLDocument): boolean => {
  const feedElement = feedBody.querySelector(`feed:root`);
  if (feedElement === null) return false;

  return feedElement.namespaceURI === "http://www.w3.org/2005/Atom";
};

const probeIsRssFeed = (feedBody: XMLDocument): boolean =>
  feedBody.querySelector("rss:root") !== null;

const fetchFeed = async (url: string): Promise<Feed | undefined> => {
  // This will return 404 if a syndication feed could not be found at the URL.
  const res = await fetch(`https://feed.indiefeed.link/${url}`);
  if (!res.ok) return undefined;

  const feedBody = new DOMParser().parseFromString(await res.text(), ContentType.Xml);

  const contentTypeHeader = res.headers.get("Content-Type");
  if (contentTypeHeader === null) return undefined;

  const feedContentType = contentType.parse(contentTypeHeader).type;

  // Many websites do not serve their syndication feeds with the correct `Content-Type`. If they do,
  // then the serverless function will return it with that content type. If they do not, then the
  // serverless function will return it with a content type of `application/xml`, leaving the client
  // to infer the kind of feed by probing its contents.

  if (feedContentType === ContentType.Atom || probeIsAtomFeed(feedBody))
    return {
      kind: "atom",
      body: feedBody,
    };

  if (feedContentType === ContentType.Rss || probeIsRssFeed(feedBody))
    return {
      kind: "rss",
      body: feedBody,
    };

  return undefined;
};

export const SyndicationFeed = ({ url }: { url: string }) => {
  const [feed, setFeed] = useState<Feed>();

  useEffect(() => {
    fetchFeed(url).then((rawFeed) => setFeed(rawFeed));
  }, [url]);

  // We could not get a syndication feed from this URL.
  if (feed === undefined) return <FeedNotFound url={url} />;

  switch (feed.kind) {
    case "atom":
      return <AtomFeed feedDoc={feed.body} />;
    case "rss":
      return <RssFeed feedDoc={feed.body} />;
  }
};
