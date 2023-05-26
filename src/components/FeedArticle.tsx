import "./FeedArticle.css";

export interface FeedArticleProps {
  url: URL;
  title: string;
  subtitle: string;
  categories: ReadonlyArray<string>;
}

export const FeedArticle = ({ url, title, subtitle, categories }: FeedArticleProps) => {
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
      </a>
    </article>
  );
};
