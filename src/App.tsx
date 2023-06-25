import "./App.css";
import { SyndicationFeed } from "./components/SyndicationFeed";

function App() {
  return (
    <div className="App">
      <main>
        <SyndicationFeed url={window.location.pathname.slice(1)} />
      </main>
    </div>
  );
}

export default App;
