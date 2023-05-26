import { Feed } from "./components/Feed";
import "./App.css";
import { FeedArticle } from "./components/FeedArticle";

function App() {
  return (
    <div className="App">
      <main>
        <Feed>
          <FeedArticle
            url={new URL("https://example.com")}
            title="Starship Explodes Again"
            subtitle={'"This was the best possible outcome," says Musk.'}
            categories={["News", "Tech"]}
          ></FeedArticle>
          <FeedArticle
            url={new URL("https://example.com")}
            title="Literal Bull Loose in New York Stock Exchange"
            subtitle="The SEC is responding to reports of a bull market."
            categories={["Finance"]}
          ></FeedArticle>
        </Feed>
      </main>
    </div>
  );
}

export default App;
