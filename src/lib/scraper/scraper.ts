import { decode } from "html-entities"
import type { FollowShortUrlResponse } from "./utils"
import { followShortUrl, randomUserAgent } from "./utils"

type GetValueOption = { selector: string; attribute?: string }

type ScrapeResponse = string | string[] | JSON

export type GetMetadataOptions = {
  name: string
  selectors: GetValueOption[]
  multiple: boolean
}

/**
 * Scraper rules
 * For each rule, the first selector that matches will be used
 */
export const scraperRules: GetMetadataOptions[] = [
  {
    name: "title",
    multiple: false,
    selectors: [
      { selector: 'meta[name="og:title"]', attribute: "content" },
      { selector: 'meta[property="og:title"]', attribute: "content" },
      { selector: "meta[name=title]", attribute: "content" },
      { selector: 'meta[name="twitter:title"]', attribute: "content" },
      { selector: 'meta[property="twitter:title"]', attribute: "content" },
      { selector: "title" },
      { selector: 'h1[slot="title"]' },
      { selector: ".post-title" },
      { selector: ".entry-title" },
      { selector: 'h1[class*="title" i] a' },
      { selector: 'h1[class*="title" i]' },
    ],
  },
  {
    name: "description",
    multiple: false,
    selectors: [
      { selector: "status-body" },
      { selector: 'meta[name="og:description"]', attribute: "content" },
      { selector: 'meta[property="og:description"]', attribute: "content" },
      {
        selector: 'meta[name="twitter:description"]',
        attribute: "content",
      },
      {
        selector: 'meta[property="twitter:description"]',
        attribute: "content",
      },
      { selector: 'meta[itemprop="description"]', attribute: "content" },
      { selector: 'meta[name="description"]', attribute: "content" },
    ],
  },
  {
    name: "author",
    multiple: false,
    selectors: [
      { selector: "link[rel=author]", attribute: "href" },
      { selector: 'meta[name="author"]', attribute: "content" },
      { selector: 'meta[name="article:author"]', attribute: "content" },
      { selector: 'meta[property="article:author"]', attribute: "content" },
      { selector: '[itemprop*="author" i] [itemprop="name"]' },
    ],
  },
  {
    name: "image",
    multiple: false,
    selectors: [
      {
        selector: 'link[rel="image_src"]',
        attribute: "href",
      },
      { selector: 'meta[name="og:image"]', attribute: "content" },
      { selector: 'meta[property="og:image"]', attribute: "content" },
      { selector: 'meta[name="og:image:url"]', attribute: "content" },
      { selector: 'meta[property="og:image:url"]', attribute: "content" },
      {
        selector: 'meta[name="og:image:secure_url"]',
        attribute: "content",
      },
      {
        selector: 'meta[property="og:image:secure_url"]',
        attribute: "content",
      },
      { selector: 'meta[name="twitter:image:src"]', attribute: "content" },
      {
        selector: 'meta[property="twitter:image:src"]',
        attribute: "content",
      },
      { selector: 'meta[name="twitter:image"]', attribute: "content" },
      { selector: 'meta[property="twitter:image"]', attribute: "content" },
      { selector: 'meta[itemprop="image"]', attribute: "content" },
    ],
  },
  {
    name: "feeds",
    multiple: true,
    selectors: [
      {
        selector: 'link[type="application/rss+xml"]',
        attribute: "href",
      },
      { selector: 'link[type="application/feed+json"]', attribute: "href" },
      { selector: 'link[type="application/atom+xml"]', attribute: "href" },
    ],
  },
  {
    name: "date",
    multiple: false,
    selectors: [
      { selector: 'meta[name="date" i]', attribute: "content" },
      { selector: '[itemprop*="date" i]', attribute: "content" },
      { selector: 'time[itemprop*="date" i]', attribute: "datetime" },
      { selector: "time[datetime]", attribute: "datetime" },
      { selector: "time" },
    ],
  },
  {
    name: "lang",
    multiple: false,
    selectors: [
      { selector: 'meta[name="og:locale"]', attribute: "content" },
      { selector: 'meta[property="og:locale"]', attribute: "content" },
      { selector: 'meta[itemprop="inLanguage"]', attribute: "content" },
      { selector: "html", attribute: "lang" },
    ],
  },
  {
    name: "logo",
    multiple: false,
    selectors: [
      { selector: 'meta[name="og:logo"]', attribute: "content" },
      { selector: 'meta[property="og:logo"]', attribute: "content" },
      { selector: 'meta[itemprop="logo"]', attribute: "content" },
      { selector: 'img[itemprop="logo"]', attribute: "src" },
      {
        selector: 'link[rel="apple-touch-icon-precomposed"]',
        attribute: "href",
      },
    ],
  },
  {
    name: "video",
    multiple: false,
    selectors: [
      {
        selector: 'meta[name="og:video:secure_url"]',
        attribute: "content",
      },
      {
        selector: 'meta[property="og:video:secure_url"]',
        attribute: "content",
      },
      { selector: 'meta[name="og:video:url"]', attribute: "content" },
      { selector: 'meta[property="og:video:url"]', attribute: "content" },
      { selector: 'meta[name="og:video"]', attribute: "content" },
      { selector: 'meta[property="og:video"]', attribute: "content" },
    ],
  },
  {
    name: "keywords",
    multiple: false,
    selectors: [
      {
        selector: 'meta[name="keywords"]',
        attribute: "content",
      },
    ],
  },
  {
    name: "jsonld",
    multiple: false,
    selectors: [
      {
        selector: '#content #microformat script[type="application/ld+json"]',
      },
      {
        selector: 'ytd-player-microformat-renderer script[type="application/ld+json"]',
      },
      {
        selector: 'script[type="application/ld+json"]',
      },
    ],
  },
]

const cleanText = (string: string) => decode(string.trim(), { level: "html5" })

export class Scraper {
  rewriter: HTMLRewriter
  url: string
  response: Response
  metadata: ScrapeResponse
  unshortenedInfo: FollowShortUrlResponse

  constructor() {
    this.url = ""
    this.response = new Response()
    this.rewriter = new HTMLRewriter()
    this.metadata = {} as ScrapeResponse
    this.unshortenedInfo = {} as FollowShortUrlResponse
  }

  async fetch(url: string): Promise<Response> {
    this.url = url
    this.unshortenedInfo
    try {
      this.unshortenedInfo = await followShortUrl([url])
    } catch (error) {
      throw new Error(`Unable to follow URL: ${error}`)
    }
    this.response = await fetch(this.unshortenedInfo.unshortened_url || url, {
      headers: {
        referrer: "http://www.google.com/",
        "User-Agent": randomUserAgent(),
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    })

    const server = this.response.headers.get("server")

    const isThisWorkerErrorNotErrorWithinScrapedSite =
      [530, 503, 502, 403, 400].includes(this.response.status) &&
      (server === "cloudflare" || !server) /* Workers preview editor */

    if (isThisWorkerErrorNotErrorWithinScrapedSite) {
      throw new Error(`Status ${this.response.status} requesting ${url}`)
    }

    return this.response
  }

  async getMetadata(options: GetMetadataOptions[]): Promise<Record<string, string | string[]>> {
    const matches: Record<string, string | string[]> = {}
    const selectedSelectors: Record<string, boolean> = {}

    for (const optionsItem of options) {
      const name = optionsItem.name
      const isMultiple = optionsItem.multiple

      if (!matches[name]) {
        if (isMultiple) {
          matches[name] = []
        } else {
          matches[name] = ""
        }
      }

      for await (const item of optionsItem.selectors) {
        const selector = item.selector
        let nextText = ""

        if (selectedSelectors[name]) {
          break
        }

        this.rewriter.on(selector, {
          element(element: Element) {
            if (item.attribute) {
              const attrText = element.getAttribute(item.attribute)
              if (attrText) {
                nextText = attrText

                if (isMultiple) {
                  Array.isArray(matches[name]) &&
                    (matches[name] as string[]).push(cleanText(nextText))
                } else {
                  if (matches[name] === "") {
                    matches[name] = cleanText(nextText)
                    selectedSelectors[name] = true
                  }
                }
              }
            } else {
              nextText = ""
            }
          },
          text(text) {
            if (!item.attribute) {
              nextText += text.text

              if (text.lastInTextNode) {
                if (isMultiple) {
                  Array.isArray(matches[name]) &&
                    (matches[name] as string[]).push(cleanText(nextText))
                } else {
                  if (matches[name] === "") {
                    matches[name] = cleanText(nextText)
                    selectedSelectors[name] = true
                  }
                }
                nextText = ""
              }
            }
          },
        })
      }
    }

    const transformed = this.rewriter.transform(this.response)
    await transformed.arrayBuffer()

    return matches
  }
}
