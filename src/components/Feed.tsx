import { FeedArticleData } from "./FeedArticle";
import "./Feed.css";
import { ReactElement, useCallback, useState } from "react";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";

export const Feed = ({
  title,
  url,
  children,
}: {
  title: string;
  url?: string;
  children: Array<ReactElement<FeedArticleData>>;
}) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = useCallback(() => {
    if (url === undefined) return;

    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [url]);

  return (
    <>
      <h1 className="feed-name">{title}</h1>
      {url && (
        <section className="feed-url-block">
          <div>Copy this URL into your RSS reader</div>
          <div className="feed-url">
            {url}
            <button onClick={copyUrl}>
              <span hidden={copied}>
                <BsClipboard title="Copy" />
              </span>
              <span hidden={!copied}>
                <BsClipboardCheck title="Copy" />
              </span>
            </button>
          </div>
          <div className="copied-text" hidden={!copied} aria-live="polite">
            Copied!
          </div>
        </section>
      )}
      <section className="feed">{children}</section>
    </>
  );
};
