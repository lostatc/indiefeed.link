import contentType from "content-type";
import { decode as decodeHtml } from "html-entities";

const ContentType = {
  Atom: "application/atom+xml",
  Rss: "application/rss+xml",
  Xml: "application/xml",
  Html: "text/html",
} as const;

// We need to accept a wide range of content types because some sites are weird.
const AcceptableContentTypes = {
  Atom: ["application/atom+xml", "text/atom+xml", "application/atom", "text/atom"],
  Rss: ["application/rss+xml", "text/rss+xml", "application/rss", "text/rss"],
  Xml: ["application/xml", "text/xml"],
} as const;

// We have a separate `xml` type for cases where the origin server does not make it clear enough
// whether the feed is an Atom or RSS feed. For this case, the client will need to probe the actual
// payload to infer which kind of feed it is.
type FeedKind = "atom" | "rss" | "xml";

// Return the preferred content type for a given type of syndication feed.
const feedContentType = (kind: FeedKind): string => {
  switch (kind) {
    case "atom":
      return ContentType.Atom;
    case "rss":
      return ContentType.Rss;
    case "xml":
      return ContentType.Xml;
  }
};

// Return a list of acceptable content types for a given type of syndication feed. These are content
// types that we look for when identifying if a page is a syndication feed.
const acceptableFeedContentTypes = (kind: FeedKind): ReadonlyArray<string> => {
  switch (kind) {
    case "atom":
      return AcceptableContentTypes.Atom;
    case "rss":
      return AcceptableContentTypes.Rss;
    case "xml":
      return AcceptableContentTypes.Xml;
  }
};

// Return whether the given response object has one of the given content types.
const hasContentType = (res: Response, contentTypes: ReadonlyArray<string>): boolean => {
  const contentTypeHeader = res.headers.get("Content-Type");
  if (contentTypeHeader === null) return false;

  const parsedContentType = contentType.parse(contentTypeHeader).type;
  return contentTypes.includes(parsedContentType);
};

// Infer the kind of syndication feed that is in the body of the given response object based on its
// `Content-Type` header.
const inferFeedKind = (res: Response): FeedKind | undefined => {
  if (hasContentType(res, AcceptableContentTypes.Atom)) {
    return "atom";
  } else if (hasContentType(res, AcceptableContentTypes.Rss)) {
    return "rss";
  } else if (hasContentType(res, AcceptableContentTypes.Xml)) {
    return "xml";
  } else {
    return undefined;
  }
};

interface FeedUrl {
  kind: FeedKind;
  url: string;
}

class FeedLinkParser {
  feedKinds: ReadonlyArray<FeedKind>;
  feedUrl: FeedUrl | undefined;

  constructor(feedKinds: ReadonlyArray<FeedKind>) {
    this.feedKinds = feedKinds;
    this.feedUrl = undefined;
  }

  element(element: Element) {
    // We stop on the first syndication feed we find.
    if (this.feedUrl !== undefined) return;

    const relAttr = decodeHtml(element.getAttribute("rel"));
    const typeAttr = decodeHtml(element.getAttribute("type"));
    const hrefAttr = decodeHtml(element.getAttribute("href"));

    console.log(`Parsing HTML: <link rel="${relAttr}" type="${typeAttr}" href="${hrefAttr}" />`);

    if (relAttr !== "alternate" || hrefAttr === null) return;

    for (const feedKind of this.feedKinds) {
      if (acceptableFeedContentTypes(feedKind).includes(typeAttr)) {
        console.log(`Found ${feedKind} feed: ${hrefAttr}`);

        this.feedUrl = {
          kind: feedKind,
          url: hrefAttr,
        };
      }
    }
  }
}

// Parse an HTML document and extract a syndication feed link from its `<link>` tag.
const getFeedUrlFromDocument = async (res: Response): Promise<FeedUrl | undefined> => {
  // We prefer Atom feeds to RSS feeds.
  const feedLinkParser = new FeedLinkParser(["atom", "rss"]);
  const rewriter = new HTMLRewriter().on("link", feedLinkParser);

  // Even though we're throwing out the result, we must await this to actually parse the response.
  await rewriter.transform(res).text();

  const feedUrl = feedLinkParser.feedUrl;
  if (feedUrl === undefined) return undefined;

  return feedUrl;
};

interface Feed {
  kind: FeedKind;
  body: string;
}

// Get a syndication feed from a response object, either of the feed itself or of a web page that
// links to it in the HTML header.
const getFeed = async (res: Response): Promise<Feed | undefined> => {
  const maybeFeedKind = inferFeedKind(res);
  if (maybeFeedKind !== undefined) {
    console.log(`URL is a ${maybeFeedKind} feed.`);

    return {
      kind: maybeFeedKind,
      body: await res.text(),
    };
  }

  if (!hasContentType(res, [ContentType.Html])) {
    console.log("URL is not a syndication feed or an HTML document!");
    return undefined;
  }

  const feedUrl = await getFeedUrlFromDocument(res);
  if (feedUrl === undefined) {
    console.log("HTML document did not contain a link to a syndication feed.");
    return undefined;
  }

  console.log(`Fetching syndication feed: ${feedUrl.url}`);
  const feedRes = await fetch(feedUrl.url);

  // We ignore the media type in the `<link>` because it sometimes lies about whether the feed is an
  // Atom or RSS feed. Instead, we use the `Content-Type` returned by the feed itself. In many
  // cases, this will be `application/xml` or `text/xml`, in which case the client will have to
  // probe the contents to infer which kind of feed it is.
  const feedKind = inferFeedKind(feedRes);
  if (feedKind === undefined) {
    console.log("Syndication feed has an unrecognized content type.");
    return undefined;
  }

  return {
    kind: feedKind,
    body: await feedRes.text(),
  };
};

const parseUrl = (url: string): string => {
  const reqUrl = new URL(url);
  const feedUrl = reqUrl.pathname.slice(1);
  if (feedUrl.startsWith("https://")) return feedUrl;
  return `https://${feedUrl}`;
};

const handler = {
  async fetch(request: Request): Promise<Response> {
    const url = parseUrl(request.url);

    console.log(`Fetching page: ${url}`);
    const res = await fetch(url);
    const feed = await getFeed(res);

    if (feed === undefined) return new Response(undefined, { status: 404 });

    return new Response(feed.body, {
      status: 200,
      headers: {
        "Content-Type": feedContentType(feed.kind),
      },
    });
  },
};

export default handler;
