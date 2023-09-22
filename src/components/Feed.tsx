import { FeedArticleData } from "./FeedArticle";
import "./Feed.css";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { BsClipboard, BsClipboardCheck } from "react-icons/bs";
import { Tooltip } from "bootstrap";
import { FeedInfoLink } from "./FeedInfoLink";

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

  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const [tooltip, setTooltip] = useState<Tooltip>();

  useEffect(() => {
    if (copyButtonRef.current !== null) {
      setTooltip(new Tooltip(copyButtonRef.current));
    }
  }, []);

  useEffect(() => {
    if (copyButtonRef.current === null || tooltip === undefined) return;

    if (copied) {
      copyButtonRef.current.setAttribute("data-bs-original-title", "Copied!");
    } else {
      copyButtonRef.current.setAttribute("data-bs-original-title", "Copy");
    }

    if (copied) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }, [copied, tooltip]);

  return (
    <main>
      <h1 className="feed-name">{title}</h1>
      {url && (
        <section className="feed-details">
          <div className="feed-url-section">
            <div>Copy this URL into your feed reader</div>
            <div className="feed-url">
              {url}
              <button
                onClick={copyUrl}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Copy"
                aria-label="Copy"
                ref={copyButtonRef}
              >
                <span hidden={copied}>
                  <BsClipboard aria-hidden />
                </span>
                <span hidden={!copied}>
                  <BsClipboardCheck aria-hidden />
                </span>
              </button>
            </div>
          </div>
          <FeedInfoLink />
        </section>
      )}
      <section className="feed">{children}</section>
    </main>
  );
};
