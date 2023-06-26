import { FeedArticleData } from "./FeedArticle";
import "./Feed.css";
import { ReactElement } from "react";

export const Feed = ({
  title,
  children,
}: {
  title: string;
  children: Array<ReactElement<FeedArticleData>>;
}) => {
  return (
    <>
      <h1 className="feed-name">{title}</h1>
      <section className="feed">{children}</section>;
    </>
  );
};
