import contentType from "content-type";
import { decode as decodeHtml } from "html-entities";

const ContentType = {
  Atom: "application/atom+xml",
  Rss: "application/rss+xml",
  Xml: "application/xml",
  Html: "text/html",
} as const;

type FeedKind = "atom" | "rss";

const feedContentType = (kind: FeedKind): string => {
  switch (kind) {
    case "atom":
      return ContentType.Atom;
    case "rss":
      return ContentType.Rss;
  }
};

const hasContentType = (res: Response, contentTypes: ReadonlyArray<string>): boolean => {
  const contentTypeHeader = res.headers.get("Content-Type");
  if (contentTypeHeader === null) return false;

  const parsedContentType = contentType.parse(contentTypeHeader).type;
  return contentTypes.includes(parsedContentType);
};

const inferFeedKind = (res: Response): FeedKind | undefined => {
  if (hasContentType(res, [feedContentType("atom")])) {
    return "atom";
  } else if (hasContentType(res, [feedContentType("rss")])) {
    return "rss";
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
      if (typeAttr === feedContentType(feedKind)) {
        console.log(`Found ${feedKind} feed: ${hrefAttr}`);

        this.feedUrl = {
          kind: feedKind,
          url: hrefAttr,
        };
      }
    }
  }
}

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

const getFeed = async (res: Response): Promise<Feed | undefined> => {
  const feedKind = inferFeedKind(res);
  if (feedKind !== undefined) {
    console.log(`URL is a ${feedKind} feed.`);

    return {
      kind: feedKind,
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

  return {
    kind: feedUrl.kind,
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
