import { useMemo, useState } from "react";
import { isNotUndefined } from "../types";
import { Feed } from "./Feed";
import { FeedArticle, FeedArticleProps } from "./FeedArticle";

const parseFeed = (doc: XMLDocument): ReadonlyArray<FeedArticleProps> => {
  // The URL to use if individual entries (for some reason) don't have URLs.
  const fallbackUrl = doc.querySelector("rss > channel > link")?.textContent ?? undefined;

  const entries = doc.querySelectorAll("rss > channel > item");

  return Array.from(entries).map((entry) => {
    const date = entry.querySelector("pubDate")?.textContent ?? undefined;

    return {
      url: entry.querySelector("link")?.textContent ?? fallbackUrl ?? undefined,
      title: entry.querySelector("title")?.textContent ?? undefined,
      subtitle: entry.querySelector("description")?.textContent ?? undefined,
      categories: Array.from(entry.querySelectorAll("category"))
        .map((category) => category.textContent ?? undefined)
        .filter(isNotUndefined),
      date: date !== undefined ? new Date(date) : undefined,
      authorName: entry.querySelector("author")?.textContent ?? undefined,
    };
  });
};

export const RssFeed = ({ feedDoc }: { feedDoc: XMLDocument }) => {
  const [articleProps, setArticleProps] = useState<ReadonlyArray<FeedArticleProps>>();

  useMemo(() => {
    if (feedDoc === undefined) return;
    setArticleProps(parseFeed(feedDoc));
  }, [feedDoc]);

  return <Feed>{articleProps?.map((articleProps) => FeedArticle(articleProps)) ?? []}</Feed>;
};
