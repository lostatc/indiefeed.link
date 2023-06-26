import { useMemo, useState } from "react";
import { FeedArticle, FeedArticleData } from "./FeedArticle";
import { Feed } from "./Feed";
import { isNotUndefined } from "../types";
import { htmlToText, truncateArticleSummary } from "../text";

interface FeedContent {
  title: string;
  articles: ReadonlyArray<FeedArticleData>;
}

const parseFeed = (doc: XMLDocument): FeedContent => {
  // The author to use if individual entries don't have authors.
  const fallbackAuthor = doc.querySelector("feed > author > name")?.textContent ?? undefined;

  // The URL to use if individual entries (for some reason) don't have URLs.
  const fallbackUrl =
    doc.querySelector(`feed > link[rel="alternate"][type="text/html"]`)?.getAttribute("href") ??
    undefined;

  const entries = doc.querySelectorAll("feed > entry");

  const title = doc.querySelector("feed > title")?.textContent ?? "Feed";

  const articles = Array.from(entries).map((entry) => {
    const date =
      entry.querySelector("published")?.textContent ??
      entry.querySelector("updated")?.textContent ??
      undefined;

    const summaryElement =
      entry.querySelector("summary") ?? entry.querySelector("content") ?? undefined;
    const rawSummary = summaryElement?.textContent ?? undefined;

    let summary = rawSummary;

    if (summaryElement !== undefined && rawSummary !== undefined) {
      const summaryType = summaryElement.getAttribute("type");

      if (summaryType === "html" || summaryType === "xhtml") {
        summary = htmlToText(rawSummary);
      }
    }

    return {
      url:
        entry.querySelector(`link[rel="alternate"][type="text/html"]`)?.getAttribute("href") ??
        fallbackUrl ??
        undefined,
      title: entry.querySelector("title")?.textContent ?? undefined,
      summary: summary === undefined ? undefined : truncateArticleSummary(summary),
      categories: Array.from(entry.querySelectorAll("category"))
        .map(
          (category) => category.getAttribute("label") ?? category.getAttribute("term") ?? undefined
        )
        .filter(isNotUndefined),
      date: date !== undefined ? new Date(date) : undefined,
      authorName: entry.querySelector("author > name")?.textContent ?? fallbackAuthor,
    };
  });

  return { title, articles };
};

export const AtomFeed = ({ feedDoc }: { feedDoc: XMLDocument }) => {
  const [feedContent, setFeedContent] = useState<FeedContent>();

  useMemo(() => {
    if (feedDoc === undefined) return;
    setFeedContent(parseFeed(feedDoc));
  }, [feedDoc]);

  if (feedContent === undefined) return <></>;

  return (
    <Feed title={feedContent.title}>
      {feedContent.articles?.map((articleData, index) =>
        FeedArticle({ key: index, ...articleData })
      ) ?? []}
    </Feed>
  );
};
