import { FeedArticleProps } from "./FeedArticle";
import "./Feed.css";
import { ReactElement } from "react";

export const Feed = ({ children }: { children: Array<ReactElement<FeedArticleProps>> }) => {
  return <section className="Feed">{children}</section>;
};
