import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { BackLink } from "./BackLink";
import "./ErrorPage.css";

export interface ErrorPageLink {
  text: string;
  href: string;
}

export const ErrorPage = ({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle: string;
  link?: ErrorPageLink;
}) => {
  return (
    <section className="error-page">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>
      {link && <BackLink text={link.text} href={link.href} />}
    </section>
  );
};

export const RouteErrorPage = () => {
  const error = useRouteError();

  let title = "Unexpected error";
  let subtitle = "";
  let link: ErrorPageLink | undefined = undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      subtitle = "There is nothing here";
      link = { text: "Site home", href: "/" };
    } else {
      subtitle = error.statusText;
    }
  } else if (error instanceof Error) {
    subtitle = error.message;
  } else if (typeof error === "string") {
    subtitle = error;
  }

  return <ErrorPage title={title} subtitle={subtitle} link={link} />;
};
