import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./ErrorPage.css";

export interface ErrorPageLink {
  name: string;
  url: string;
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
      {link && <a href={link.url}>{link.name}</a>}
    </section>
  );
};

export const RouteErrorPage = () => {
  const error = useRouteError();

  let title = "Unexpected error";
  let subtitle = "";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      subtitle = "There is nothing here";
    } else {
      subtitle = error.error?.message || error.statusText;
    }
  } else if (error instanceof Error) {
    subtitle = error.message;
  } else if (typeof error === "string") {
    subtitle = error;
  }

  return <ErrorPage title={title} subtitle={subtitle} />;
};
