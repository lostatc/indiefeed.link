import "./FeedNotFound.css";

export const FeedNotFound = ({ url }: { url: string }) => {
  return (
    <section className="not-found-page">
      <h1 className="header">Could not find feed</h1>
      <p className="feed-url">{url}</p>
    </section>
  );
};
