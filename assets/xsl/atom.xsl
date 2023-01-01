<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" exclude-result-prefixes="atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="{{ .Site.LanguageCode }}" dir="{{ default "ltr" .Language.LanguageDirection }}" data-scheme="dark">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="description">
          <xsl:attribute name="content">
            <xsl:value-of select="atom:feed/atom:subtitle"/>
          </xsl:attribute>
        </meta>
        <title><xsl:value-of select="atom:feed/atom:title"/> Feed</title>
        <link rel="canonical">
          <xsl:attribute name="href">
            <xsl:value-of select="atom:feed/atom:link[@rel='self']/@href"/>
          </xsl:attribute>
        </link>
        <link rel="alternate" type="application/atom+xml">
          <xsl:attribute name="href">
            <xsl:value-of select="atom:feed/atom:link[@rel='self']/@href"/>
          </xsl:attribute>
        </link>
        <link rel="shortcut icon">
          <xsl:attribute name="href">
            <xsl:value-of select="atom:feed/atom:icon"/>
          </xsl:attribute>
        </link>
        {{- $css := resources.Get "scss/style.scss" | resources.ToCSS | minify | resources.Fingerprint "sha256" }}
        <link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}" crossorigin="anonymous"/>
      </head>
      <body>
        <div class="container main-container flex on-phone--column compact">
          <div class="main full-width">
            <main class="d-contents">
              <div class="feed-header">
                {{ partial "helper/icon" "rss" }}
                <div>
                  <div class="feed-title">
                    {{ partial "helper/icon" "rss" }}
                    <h1><xsl:value-of select="atom:feed/atom:title"/> Feed</h1>
                  </div>
                  <div class="feed-text">
                    <p>
                      This is an RSS feed. You can paste this URL into any RSS
                      reader to get new posts from <xsl:value-of select="atom:feed/atom:title"/>.
                    </p>
                  </div>
                  <a class="feed-backlink">
                    <xsl:attribute name="href">
                      <xsl:value-of select="atom:feed/atom:link[@rel='alternate' AND @type='text/html']/@href"/>
                    </xsl:attribute>
                    {{ partial "helper/icon" "arrow-back" }}
                    <span class="link">Back to <xsl:value-of select="atom:feed/atom:title"/></span>
                  </a>
                </div>
              </div>
              <section class="article-list">
                <xsl:apply-templates select="atom:feed/atom:entry"/>
              </section>
            </main>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="atom:feed/atom:entry">
    <article>
      <header class="article-header">
        <div class="article-details">
          <header class="article-category">
            <xsl:for-each select="atom:category">
              <a>
                <xsl:attribute name="href">/category/<xsl:value-of select="@term"/>/</xsl:attribute>
                <xsl:value-of select="@label"/>
              </a>
            </xsl:for-each>
          </header>
          <div class="article-title-wrapper">
            <h2 class="article-title">
              <a>
                <xsl:attribute name="href"><xsl:value-of select="atom:link[@rel='alternate']/@href"/></xsl:attribute>
                <xsl:value-of select="atom:title"/>
              </a>
            </h2>
            <h3 class="article-subtitle"><xsl:value-of select="atom:summary"/></h3>
          </div>
          <footer class="article-time">
            <div>
              {{ partial "helper/icon" "date" }}
              <time class="article-time--published">
                <xsl:attribute name="datetime">
                  <xsl:value-of select="atom:published"/>
                </xsl:attribute>
                <xsl:call-template name="date">
                  <xsl:with-param name="date" select="atom:published"/>
                </xsl:call-template>
              </time>
            </div>
          </footer>
        </div>
      </header>
    </article>
  </xsl:template>
  <xsl:template name="date">
    <xsl:param name="date"/>
    <xsl:variable name="year" select="substring($date, 1, 4)"/>
    <xsl:variable name="month" select="substring($date, 6, 2)"/>
    <xsl:variable name="day" select="substring($date, 9, 2)"/>
    <xsl:value-of select="$day"/>
    <xsl:text> </xsl:text>
    <xsl:choose>
      <xsl:when test="$month=01">Jan</xsl:when>
      <xsl:when test="$month=02">Feb</xsl:when>
      <xsl:when test="$month=03">Mar</xsl:when>
      <xsl:when test="$month=04">Apr</xsl:when>
      <xsl:when test="$month=05">May</xsl:when>
      <xsl:when test="$month=06">Jun</xsl:when>
      <xsl:when test="$month=07">Jul</xsl:when>
      <xsl:when test="$month=08">Aug</xsl:when>
      <xsl:when test="$month=09">Sep</xsl:when>
      <xsl:when test="$month=10">Oct</xsl:when>
      <xsl:when test="$month=11">Nov</xsl:when>
      <xsl:when test="$month=12">Dec</xsl:when>
    </xsl:choose>
    <xsl:text> </xsl:text>
    <xsl:value-of select="$year"/>
  </xsl:template>
</xsl:stylesheet>
