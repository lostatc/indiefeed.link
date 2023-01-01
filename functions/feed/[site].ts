import * as ContentType from "content-type";

interface Env {}

const Header = {
  ContentType: "Content-Type",
  CacheControl: "Cache-Control",
  Allow: "Allow",
} as const;

const getUrlFromString = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
    if (url.startsWith("https://")) return null;

    try {
      return new URL(`https://${url}`);
    } catch {
      return null;
    }
  }
};

type FeedKind = "rss" | "atom";

interface OriginFeed {
  url: URL;
  kind: FeedKind;
}

const feedKindPrecedence: ReadonlyArray<FeedKind> = ["atom", "rss"];

const atomMediaTypes = ["application/atom+xml"];

const rssMediaTypes = ["application/rss", "application/rss+xml", "text/rss", "text/rss+xml"];

const feedKindFromMediaType = (mediaType: string): FeedKind | null => {
  if (atomMediaTypes.includes(mediaType)) return "atom";

  if (rssMediaTypes.includes(mediaType)) return "rss";

  return null;
};

const mediaTypeFromFeedKind = (kind: FeedKind): string => {
  switch (kind) {
    case "atom":
      return "application/atom+xml";
    case "rss":
      return "application/rss+xml";
  }
};

const sortedByKeyPrecedence = <T, U extends string | number>(
  arr: ReadonlyArray<T>,
  precedence: ReadonlyArray<U>,
  key: (value: T) => U
): Array<T> => {
  const sortOrderByKind: Record<U, number> = precedence.reduce(
    (accumulator, value, index) => ({
      ...accumulator,
      [value]: index,
    }),
    {} as Record<U, number>
  );

  const arrToSort = [...arr];

  arrToSort.sort((a, b) => {
    return sortOrderByKind[key(b)] - sortOrderByKind[key(a)];
  });

  return arrToSort;
};

const chooseBestOriginFeed = (feeds: ReadonlyArray<OriginFeed>): OriginFeed | null => {
  if (feeds.length === 0) return null;

  return sortedByKeyPrecedence(feeds, feedKindPrecedence, (feed) => feed.kind)[0];
};

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (!(await reader.read()).done) {
    /* no-op */
  }
};

const extractFeedUrlFromDom = async (response: Response): Promise<OriginFeed | null> => {
  const originFeeds: Array<OriginFeed> = [];

  const htmlRewriter = new HTMLRewriter().on("html > head > link[rel=alternate]", {
    element(element) {
      const alternateMediaType = element.getAttribute("type");

      if (alternateMediaType === null) return;

      const feedKind = feedKindFromMediaType(alternateMediaType);

      if (feedKind === null) return;

      const alternateHref = element.getAttribute("href");

      if (alternateHref === null) return;

      try {
        originFeeds.push({
          url: new URL(alternateHref),
          kind: feedKind,
        });
      } catch {
        return;
      }
    },
  });

  const transformedBody = htmlRewriter.transform(response).body!;

  if (transformedBody === null) return null;

  consumeStream(transformedBody);

  return chooseBestOriginFeed(originFeeds);
};

const getFeedUrl = async (originUrl: URL): Promise<OriginFeed | null> => {
  console.log(originUrl);
  const originPageResponse = await fetch(originUrl.toString(), { method: "GET" });
  const originPageContentType = originPageResponse.headers.get(Header.ContentType);

  if (originPageContentType === null) return null;

  const originPageMediaType = ContentType.parse(originPageContentType).type;
  const originFeedKind = feedKindFromMediaType(originPageMediaType);

  if (originFeedKind !== null)
    return {
      url: originUrl,
      kind: originFeedKind,
    };

  return await extractFeedUrlFromDom(originPageResponse);
};

const xslPath = (kind: FeedKind): string => {
  switch (kind) {
    case "atom":
      return "/xsl/atom.xsl";
    case "rss":
      return "/xsl/rss.xsl";
  }
};

const respondWithFeedPage = async (feed: OriginFeed): Promise<Response> => {
  // TODO: Request the syndication feed from the origin URL and inject the `<?xml-stylesheet?>`
  // directive.
  const { readable, writable } = new TransformStream();

  let writer = writable.getWriter();
  writer.write(`<?xml-stylesheet type="text/xsl" href="${xslPath(feed.kind)}" media="screen"?>\n`);
  await writer.close();

  const originFeedRequest = await fetch(feed.url.toString(), { method: "GET" });
  const originFeedBody = originFeedRequest.body;

  if (originFeedBody === null) {
    // TODO: Handle this gracefully with a nice error page.
    throw new Error(`There is no syndication feed at this URL: ${feed.url}`);
  }

  originFeedBody.pipeTo(writable);

  return new Response(readable, {
    headers: {
      [Header.ContentType]: mediaTypeFromFeedKind(feed.kind),
      [Header.CacheControl]: "no-cache",
    },
  });
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "HEAD" && context.request.method != "GET") {
    return new Response(undefined, {
      status: 405,
      headers: {
        [Header.Allow]: "HEAD, GET",
        [Header.CacheControl]: "no-cache",
      },
    });
  }

  if (Array.isArray(context.params.site)) {
    throw new Error("Expecting a single path param.");
  }

  const originUrl = getUrlFromString(context.params.site);

  if (originUrl === null) {
    // TODO: Handle this gracefully with a nice error page.
    throw new Error(`This is not a valid URL: ${context.params.site}`);
  }

  const originFeedUrl = await getFeedUrl(originUrl);

  if (originFeedUrl === null) {
    // TODO: Handle this gracefully with a nice error page.
    throw new Error(`There is no syndication feed at this URL: ${context.params.site}`);
  }

  return respondWithFeedPage(originFeedUrl);
};
