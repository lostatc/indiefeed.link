import { FeedArticleData } from "./FeedArticle";
import "./Feed.css";
import { ReactElement } from "react";

export const Feed = ({ children }: { children: Array<ReactElement<FeedArticleData>> }) => {
  return <section className="Feed">{children}</section>;
};
