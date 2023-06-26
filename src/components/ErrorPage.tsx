import "./ErrorPage.css";

export const ErrorPage = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <section className="error-page">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </section>
  );
};
