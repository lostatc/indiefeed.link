import "./FeedArticle.css";
import { BsCalendar2, BsPersonCircle } from "react-icons/bs";

export interface FeedArticleProps {
  url?: string;
  title?: string;
  subtitle?: string;
  categories: ReadonlyArray<string>;
  date?: Date;
  authorName?: string;
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
  authorName,
}: FeedArticleProps) => {
  return (
    <article className="FeedArticle">
      <a className="article-body" href={url}>
        {categories.length > 0 && (
          <header>
            <ul className="article-category-list">
              {categories.map((categoryLabel) => (
                <li className="article-category">{categoryLabel}</li>
              ))}
            </ul>
          </header>
        )}
        <div className="article-title-wrapper">
          {title && <h2 className="article-title">{title}</h2>}
          {subtitle && <h3 className="article-subtitle">{subtitle}</h3>}
        </div>
        <footer className="article-detail-list">
          {date && (
            <div className="article-detail">
              <BsCalendar2 title="Date" />
              <time className="article-detail-text" dateTime={date.toISOString()}>
                {new Intl.DateTimeFormat(undefined, dateFormatOptions).format(date)}
              </time>
            </div>
          )}
          {authorName && (
            <div className="article-detail">
              <BsPersonCircle title="Author" />
              <span className="article-detail-text">{authorName}</span>
            </div>
          )}
        </footer>
      </a>
    </article>
  );
};
