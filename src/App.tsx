import { useEffect } from "react";
import "./App.css";
import { SyndicationFeed } from "./components/SyndicationFeed";

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

  return (
    <div className="App">
      <main>
        <SyndicationFeed url={window.location.pathname.slice(1)} />
      </main>
    </div>
  );
}

export default App;
