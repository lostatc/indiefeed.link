import { BsInfoCircle } from "react-icons/bs";
import "./FeedInfoLink.css";

export const FeedInfoLink = () => {
  return (
    <div className="info-link">
      <BsInfoCircle title="Info" />
      <a href="/info/">Learn more about web feeds</a>
    </div>
  );
};
