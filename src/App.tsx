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
            title="Article Title"
            subtitle="This is the article subtitle."
          ></FeedArticle>
          <FeedArticle
            url={new URL("https://example.com")}
            title="Article Title"
            subtitle="This is the article subtitle."
          ></FeedArticle>
        </Feed>
      </main>
    </div>
  );
}

export default App;
