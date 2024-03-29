// import * as cheerio from "cheerio"
// import { NodeHtmlMarkdown } from "node-html-markdown"
// import { IGNORE_TAGS } from "./constants"

// export const nhm = new NodeHtmlMarkdown(
//   {
//     ignore: ["a", "sub", "sup", ...IGNORE_TAGS],
//     keepDataImages: false,
//     useLinkReferenceDefinitions: false,
//     textReplace: [
//       [/\[.*?\]\(.*?\),+?/gm, ""],
//       [/,+/g, ""],
//       [/\(ref\..*?\)/g, ""],
//     ],
//   },
//   { a: { ignore: true } }
// )

// export type FetchPageContent = {
//   url: string
//   selectors?: string[]
// }

// export const fetchPageContent = async ({ url, selectors }: FetchPageContent) => {
//   const resp = await fetch(url)
//   const body = await resp.text()

//   const $ = cheerio.load(body, { recognizeSelfClosing: true }, false)

//   let sections: string[] = []
//   const _selectors = ["div.main-content", "main", "article", "body", ...(selectors || [])]
//   for (const selector of _selectors) {
//     sections = $(selector)
//       .map((_, section) => $(section).html())
//       .get()
//     if (sections.length) break
//   }

//   if (!sections.length) {
//     console.error("No content found.")
//     return ""
//   }

//   return nhm.translate(sections.join("\n\n"))
// }
