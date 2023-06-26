import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./ErrorPage.css";

export const ErrorPage = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <section className="error-page">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>
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
