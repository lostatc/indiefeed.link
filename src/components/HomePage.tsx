import { FeedInfoLink } from "./FeedInfoLink";
import { FeedUrlInput } from "./FeedUrlInput";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <main className="home">
      <h1 className="title text">IndieFeed.link</h1>
      <p className="body text">A landing page for your web feed.</p>
      <p className="body text">
        Link to this site to show visitors a preview of your site's RSS or Atom feed.
      </p>
      <FeedInfoLink />
      <div className="input">
        <FeedUrlInput />
      </div>
      <p className="body text">
        <a href="https://github.com/lostatc/indiefeed.link">GitHub</a>
      </p>
    </main>
  );
};
