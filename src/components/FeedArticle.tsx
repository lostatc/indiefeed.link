import "./FeedArticle.css";

export interface FeedArticleProps {
  url: URL;
  title: string;
  subtitle: string;
}

export const FeedArticle = ({ url, title, subtitle }: FeedArticleProps) => {
  return (
    <article className="FeedArticle">
      <div className="article-title-wrapper">
        <h2>
          <a href={url.toString()}>{title}</a>
        </h2>
        <h3>{subtitle}</h3>
      </div>
    </article>
  );
};
