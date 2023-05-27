import { useMemo, useState } from "react";
import { FeedArticle, FeedArticleProps } from "./FeedArticle";
import { Feed } from "./Feed";
import { isNotUndefined } from "../types";

const parseFeed = (doc: XMLDocument): ReadonlyArray<FeedArticleProps> => {
  // The author to use if individual entries don't have authors.
  const fallbackAuthor = doc.querySelector("feed > author > name")?.textContent ?? undefined;

  // The URL to use if individual entries (for some reason) don't have URLs.
  const fallbackUrl =
    doc.querySelector(`feed > link[rel="alternate"][type="text/html"]`)?.getAttribute("href") ??
    undefined;

  const entries = doc.querySelectorAll("feed > entry");

  return Array.from(entries).map((entry) => {
    const date =
      entry.querySelector("published")?.textContent ??
      entry.querySelector("updated")?.textContent ??
      undefined;

    return {
      url:
        entry.querySelector(`link[rel="alternate"][type="text/html"]`)?.getAttribute("href") ??
        fallbackUrl ??
        undefined,
      title: entry.querySelector("title")?.textContent ?? undefined,
      subtitle: entry.querySelector("summary")?.textContent ?? undefined,
      categories: Array.from(entry.querySelectorAll("category"))
        .map(
          (category) => category.getAttribute("label") ?? category.getAttribute("term") ?? undefined
        )
        .filter(isNotUndefined),
      date: date !== undefined ? new Date(date) : undefined,
      authorName: entry.querySelector("author > name")?.textContent ?? fallbackAuthor,
    };
  });
};

export const AtomFeed = ({ feedDoc }: { feedDoc: XMLDocument }) => {
  const [articleProps, setArticleProps] = useState<ReadonlyArray<FeedArticleProps>>();

  useMemo(() => {
    if (feedDoc === undefined) return;
    setArticleProps(parseFeed(feedDoc));
  }, [feedDoc]);

  return <Feed>{articleProps?.map((articleProps) => FeedArticle(articleProps)) ?? []}</Feed>;
};
