import * as cheerio from "cheerio"
import { db, ContentItem } from "astro:db"

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

  return sections
}

export const getMeta = async ({ url, selectors }: FetchPageContent) => {
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

const saveMetadata = () => {
  db.insert(contentItem).values({
    kind: "article",
    permalink: url,
  })
}
