import { StrictMode, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { RouteErrorPage } from "./components/ErrorPage";
import { HomePage } from "./components/HomePage";
import { InfoPage } from "./components/InfoPage";
import { WebFeed } from "./components/WebFeed";

const setColorScheme = (isDark: boolean) => {
  const colorScheme = isDark ? "dark" : "light";
  document.querySelector("html")?.setAttribute("data-scheme", colorScheme);
};

function App() {
  useEffect(() => {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(darkModePreference.matches);
    darkModePreference.addEventListener("change", (e) => setColorScheme(e.matches));
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <RouteErrorPage />,
    },
    {
      path: "/feed/*",
      element: <WebFeed />,
      errorElement: <RouteErrorPage />,
    },
    {
      path: "/info/",
      element: <InfoPage />,
      errorElement: <RouteErrorPage />,
    },
  ]);

  return (
    <StrictMode>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </StrictMode>
  );
}

export default App;
