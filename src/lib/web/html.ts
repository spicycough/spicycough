import * as cheerio from "cheerio"
import { NodeHtmlMarkdown } from "node-html-markdown"
import { IGNORE_TAGS } from "./constants"

const nhm = new NodeHtmlMarkdown(
  {
    ignore: ["a", "sub", "sup", ...IGNORE_TAGS],
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

export type FetchPageContent = {
  url: string
  selectors?: string[]
}

export const fetchPageContent = async ({ url, selectors }: FetchPageContent) => {
  const resp = await fetch(url)
  const body = await resp.text()

  const $ = cheerio.load(body, { recognizeSelfClosing: true }, false)

  let sections: string[] = []
  const _selectors = ["div.main-content", "main", "article", "body", ...(selectors || [])]
  for (const selector of _selectors) {
    sections = $(selector)
      .map((_, section) => $(section).html())
      .get()
    if (sections.length) break
  }

  if (!sections.length) {
    console.error("No content found.")
    return []
  }

  return nhm.translate(sections.join("\n\n"))
}

export const getMetadata = async ({ url }: { url: string }) => {
  const resp = await fetch(url)
  const body = await resp.text()

  return (await import("metascraper")).default([
    (await import("metascraper-author")).default(),
    (await import("metascraper-date")).default(),
    (await import("metascraper-description")).default(),
    (await import("metascraper-image")).default(),
    (await import("metascraper-lang")).default(),
    (await import("metascraper-logo")).default(),
    (await import("metascraper-logo-favicon")).default(),
    (await import("metascraper-publisher")).default(),
    (await import("metascraper-readability")).default(),
    (await import("metascraper-title")).default(),
    (await import("metascraper-url")).default(),
  ])({ url, html: body })
}

export const getMetaFallback = async ({ url }: FetchPageContent) => {
  const resp = await fetch(url)
  const body = await resp.text()

  const $ = cheerio.load(body, { recognizeSelfClosing: true }, false)

  return $("meta")
    .map((_, elem) => ({
      name: $(elem).attr("name") || $(elem).attr("property")?.trim(),
      value: $(elem).attr("value") || $(elem).attr("content")?.trim(),
    }))
    .get()
}
