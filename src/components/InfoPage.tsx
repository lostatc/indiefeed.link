import { BackLink } from "./BackLink";
import "./InfoPage.css";

export const InfoPage = () => {
  return (
    <main className="info">
      <div>
        <h1 className="title">About web feeds</h1>
        <p className="subtitle">
          Web feeds let you subscribe to news sites, podcasts, and more and get the latest updates
          in your feed reader.
        </p>
        <BackLink text="Site home" href="/" />
      </div>
      <ul className="resource-list">
        <li>
          <a href="https://aboutfeeds.com/">About Feeds</a> &mdash; A simple introduction to web
          feeds
        </li>
        <li>
          <a href="https://alternativeto.net/software/google-reader/">Google Reader Alternatives</a>{" "}
          &mdash; A list of feed reader apps
        </li>
        <li>
          <a href="https://github.com/AboutRSS/ALL-about-RSS">All about RSS</a> &mdash; A
          comprehensive list of resources about web feeds
        </li>
        <li>
          <a href="https://indieweb.org/">What is the IndieWeb?</a> &mdash; A philosophy that the
          web should belong to people instead of corporations
        </li>
      </ul>
    </main>
  );
};
