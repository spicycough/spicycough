import { NodeHtmlMarkdown } from "node-html-markdown"
import type { GetTextContentOptions, Sections } from "./rules"
import type { FollowShortUrlResponse } from "./utils"
import { cleanText, followShortUrl, randomUserAgent } from "./_utils"

type ScrapeMetadataResponse = string | string[] | JSON

type ScrapeTextResponse = string | string[] | JSON

const nhm = new NodeHtmlMarkdown(
  {
    ignore: ["a", "sub", "sup"],
    keepDataImages: false,
    useLinkReferenceDefinitions: false,
    textReplace: [
      [/\[.*?\]\(.*?\),+?/gm, ""],
      [/,+/g, ""],
      [/\(ref\..*?\)/g, ""],
    ],
  },
  { a: { ignore: true } }
)

export class Scraper {
  rewriter: HTMLRewriter
  url: string
  response: Response
  metadata: ScrapeMetadataResponse
  text: ScrapeTextResponse
  unshortenedInfo: FollowShortUrlResponse

  constructor() {
    this.url = ""
    this.response = new Response()
    this.rewriter = new HTMLRewriter()
    this.metadata = {} as ScrapeMetadataResponse
    this.text = {} as ScrapeTextResponse
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

  async getTextContent(options: GetTextContentOptions[]): Promise<string> {
    const sections: Sections = {}
    const selectedSelectors: Record<string, boolean> = {}

    for (const optionsItem of options) {
      const name = optionsItem.name
      const isMultiple = optionsItem.multiple

      if (!sections[name]) {
        if (isMultiple) {
          sections[name] = []
        } else {
          sections[name] = ""
        }
      }

      for await (const item of optionsItem.selectors) {
        const selector = item.selector
        let nextText = ""
        if (selectedSelectors[optionsItem.name]) {
          break
        }
        this.rewriter.on(selector, {
          element(element: Element) {
            if (item.attribute) {
              const attrText = element.textContent
              if (attrText) {
                nextText = attrText
              }
            } else {
              nextText = ""
            }
          },
          text(text) {
            if (!item.attribute) {
              nextText += text.text
            }
          },
        })
      }
    }

    const transformed = this.rewriter.transform(this.response)
    await transformed.arrayBuffer()

    const json = JSON.stringify(sections)
    return nhm.translate(json)
  }

  async getMetadata(options: GetMetadataOptions[]): Promise<Matches> {
    const matches: Matches = {}
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
