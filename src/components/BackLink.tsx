import { BsArrowReturnLeft } from "react-icons/bs";
import "./BackLink.css";

export const BackLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <div className="back-link">
      <BsArrowReturnLeft aria-hidden />
      <a href={href}>{text}</a>
    </div>
  );
};
