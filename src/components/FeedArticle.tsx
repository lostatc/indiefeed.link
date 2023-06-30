import "./FeedArticle.css";
import { BsCalendar2, BsPersonCircle } from "react-icons/bs";

export interface FeedArticleData {
  url?: string;
  title?: string;
  summary?: string;
  categories: ReadonlyArray<string>;
  date?: Date;
  authorName?: string;
}

export interface FeedArticleProps extends FeedArticleData {
  key: string | number;
}

const dateFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
} as const;

// The maximum number of categories from the feed that will be displayed in the UI.
const maxCategories = 3;

export const FeedArticle = ({
  key,
  url,
  title,
  summary,
  categories,
  date,
  authorName,
}: FeedArticleProps) => {
  return (
    <article key={key} className="FeedArticle">
      <a className="article-body" href={url}>
        {categories.length > 0 && (
          <header>
            <ul className="article-category-list">
              {categories.slice(0, maxCategories).map((categoryLabel, index) => (
                <li key={index} className="article-category">
                  {categoryLabel}
                </li>
              ))}
            </ul>
          </header>
        )}
        <div className="article-title-wrapper">
          {title && <h2 className="article-title">{title}</h2>}
          {summary && <p className="article-summary">{summary}</p>}
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
