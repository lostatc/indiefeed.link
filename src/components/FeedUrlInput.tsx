import { useCallback, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FormInput } from "./FormInput";
import "./FeedUrlInput.css";

export const FeedUrlInput = () => {
  const navigate = useNavigate();

  const [feedUrl, setFeedUrl] = useState<string>();

  const handleSubmit = useCallback(() => {
    navigate(`/feed/${feedUrl}`);
  }, [feedUrl, navigate]);

  return (
    <Form id="feed-url-form" onSubmit={handleSubmit} noValidate>
      <Form.Label id="feed-url-label" htmlFor="feed-url-input">
        Feed URL
      </Form.Label>
      <FormInput
        type="url"
        id="feed-url-input"
        aria-describedby="feed-url-help feed-url-feedback"
        placeholder="https://nytimes.com"
        onChange={(event) => {
          setFeedUrl(event.target.value);
        }}
      />
    </Form>
  );
};
