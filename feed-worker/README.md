# feed-worker

This directory is a [Cloudflare
Worker](https://developers.cloudflare.com/workers/) that returns the web feed
(Atom or RSS) associated with a given URL.

We use this worker as a CORS proxy so the React app can fetch feeds without
needing a server.

This worker accepts `GET` requests of the form:

```
https://feed.indiefeed.link/:url
```

If the URL points directly to a feed, the worker serves it. If the URL points to
a web page, the worker looks for a `<link rel="alternate">` that points to an
Atom or RSS feed.

The worker uses the `Content-Type` of the feed as served by the origin server to
determine whether it is an Atom or RSS feed. It ignores the `type` attribute of
the `<link>`, which sometimes lies. The worker does not attempt to probe the
contents of the feed to determine what kind it is.

- If the worker determines it is an Atom feed, it serves it with `Content-Type:
  application/atom+xml`.
- If the worker determines it is an RSS feed, it serves it with `Content-Type:
  application/rss+xml`.
- If the worker can't determine whether it is an Atom or RSS feed, it serves it
  with `Content-Type: application/xml`.

If the worker can't find a feed at the URL, it returns with a `404`.
