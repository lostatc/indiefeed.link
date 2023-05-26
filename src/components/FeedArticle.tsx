import "./FeedArticle.css";
import { BsCalendar2, BsClock, BsPersonCircle } from "react-icons/bs";

export interface FeedArticleProps {
  url: URL;
  title: string;
  subtitle: string;
  categories: ReadonlyArray<string>;
  date: Date;
  readTimeMinutes: number;
  authorName: string;
}

const dateFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
} as const;

export const FeedArticle = ({
  url,
  title,
  subtitle,
  categories,
  date,
  readTimeMinutes,
  authorName,
}: FeedArticleProps) => {
  return (
    <article className="FeedArticle">
      <a className="article-body" href={url.toString()}>
        <header className="article-category-list">
          {categories.map((categoryLabel) => (
            <span className="article-category">{categoryLabel}</span>
          ))}
        </header>
        <div className="article-title-wrapper">
          <h2 className="article-title">{title}</h2>
          <h3 className="article-subtitle">{subtitle}</h3>
        </div>
        <footer className="article-detail-list">
          <div className="article-detail">
            <BsCalendar2 />
            <time className="article-detail-text" dateTime={date.toISOString()}>
              {new Intl.DateTimeFormat(undefined, dateFormatOptions).format(date)}
            </time>
          </div>
          <div className="article-detail">
            <BsClock />
            <time className="article-detail-text" dateTime={`PT0H${readTimeMinutes}M`}>
              {readTimeMinutes} minute read
            </time>
          </div>
          <div className="article-detail">
            <BsPersonCircle />
            <span className="article-detail-text">{authorName}</span>
          </div>
        </footer>
      </a>
    </article>
  );
};
