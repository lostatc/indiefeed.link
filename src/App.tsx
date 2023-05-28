import "./App.css";
import { SyndicationFeed } from "./components/SyndicationFeed";

function App() {
  return (
    <div className="App">
      <main>
        <SyndicationFeed url="https://arstechnica.com" />
      </main>
    </div>
  );
}

export default App;
