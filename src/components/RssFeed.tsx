import { useMemo, useState } from "react";
import { htmlToText, truncateArticleSummary } from "../text";
import { isNotUndefined } from "../types";
import { Feed } from "./Feed";
import { FeedArticle, FeedArticleData } from "./FeedArticle";

interface FeedContent {
  title: string;
  articles: ReadonlyArray<FeedArticleData>;
}

const parseFeed = (doc: XMLDocument): FeedContent => {
  // The URL to use if individual entries (for some reason) don't have URLs.
  const fallbackUrl = doc.querySelector("rss > channel > link")?.textContent ?? undefined;

  const entries = doc.querySelectorAll("rss > channel > item");

  const title = doc.querySelector("rss > channel > title")?.textContent ?? "Feed";

  const articles = Array.from(entries).map((entry) => {
    const date = entry.querySelector("pubDate")?.textContent ?? undefined;

    // The `<description>` could be either HTML or plain text, so we interpret it as HTML and
    // convert it back to plain text to remove any literal HTML markup.
    const rawSummary = entry.querySelector("description")?.textContent ?? undefined;
    const summary = rawSummary === undefined ? undefined : htmlToText(rawSummary);

    return {
      url: entry.querySelector("link")?.textContent ?? fallbackUrl ?? undefined,
      title: entry.querySelector("title")?.textContent ?? undefined,
      summary: summary === undefined ? undefined : truncateArticleSummary(summary),
      categories: Array.from(entry.querySelectorAll("category"))
        .map((category) => category.textContent ?? undefined)
        .filter(isNotUndefined),
      date: date !== undefined ? new Date(date) : undefined,
      authorName: entry.querySelector("author")?.textContent ?? undefined,
    };
  });

  return { title, articles };
};

export const RssFeed = ({ feedDoc }: { feedDoc: XMLDocument }) => {
  const [feedContent, setFeedContent] = useState<FeedContent>();

  useMemo(() => {
    if (feedDoc === undefined) return;
    setFeedContent(parseFeed(feedDoc));
  }, [feedDoc]);

  if (feedContent === undefined) return <></>;

  return (
    <Feed title={feedContent?.title}>
      {feedContent?.articles?.map((articleProps, index) =>
        FeedArticle({ key: index, ...articleProps })
      ) ?? []}
    </Feed>
  );
};
