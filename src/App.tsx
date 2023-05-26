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
            date={new Date("2023-04-30T13:05:00Z")}
            readTimeMinutes={11}
            authorName="Joyce Messier"
          ></FeedArticle>
          <FeedArticle
            url={new URL("https://example.com")}
            title="Literal Bull Loose in New York Stock Exchange"
            subtitle="The SEC is responding to reports of a bull market."
            categories={["Finance"]}
            date={new Date("2023-05-02T10:23:11Z")}
            readTimeMinutes={7}
            authorName="Kim Kitsuragi"
          ></FeedArticle>
          <FeedArticle
            url={new URL("https://example.com")}
            title="Local Trans Woman is Very Bad at Sports"
            subtitle={
              "\"I'm not allowed to compete on the women's team. Not because I'm trans—I'm just really uncoordinated.\""
            }
            categories={["Sports"]}
            date={new Date("2023-05-03T15:42:13Z")}
            readTimeMinutes={6}
            authorName="Klaasje Amandou"
          ></FeedArticle>
        </Feed>
      </main>
    </div>
  );
}

export default App;
