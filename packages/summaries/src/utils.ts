import * as cheerio from "cheerio"
import { NodeHtmlMarkdown } from "node-html-markdown"
// import type { TiktokenModel } from "tiktoken";
// import { encoding_for_model } from "tiktoken";

const ignoreTags = [
  "area",
  "aside",
  "audio",
  "base",
  "basefont",
  "bb",
  "bdi",
  "bdo",
  "button",
  "canvas",
  "caption",
  "col",
  "colgroup",
  "command",
  "datalist",
  "dfn",
  "embed",
  "figure",
  "figcaption",
  "form",
  "head",
  "iframe",
  "input",
  "kbd",
  "keygen",
  "link",
  "map",
  "math",
  "meta",
  "meter",
  "nav",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "optgroup",
  "option",
  "output",
  "param",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "samp",
  "script",
  "select",
  "source",
  "style",
  "svg",
  "table",
  "template",
  "textarea",
  "time",
  "title",
  "track",
  "tt",
  "var",
  "video",
  "wbr",
]

export const nhm = new NodeHtmlMarkdown(
  {
    ignore: ["a", "sub", "sup", ...ignoreTags],
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

export const getPageContent = async (url: string) => {
  const resp = await fetch(url)
  const body = await resp.text()

  const $ = cheerio.load(body, { recognizeSelfClosing: true }, false)

  let sections: string[] = []
  const selectors = ["div.main-content", "main", "article", "body"]
  for (const selector of selectors) {
    sections = $(selector)
      .map((_, section) => $(section).html())
      .get()
    if (sections.length) break
  }

  if (!sections.length) throw new Error("No content found.")

  return sections
}

const REGEX_MARKDOWN_HEADERS = /^(#{1,4})\s+(.*)/gm // 'g' for global, 'm' for multiline

const buildHeadingCounts = (pageContent: string) => {
  const headings = pageContent.match(REGEX_MARKDOWN_HEADERS)

  const headingLevels = headings.map((heading) => {
    const match = heading.match(/^#{1,4}/)
    return match ? match[0].length : 0
  })

  return headingLevels.reduce(
    (acc, level) => {
      acc[level] = (acc[level] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

// Identify the most common, highest-priority heading level
const findMostCommonHeading = (headingCounts: Record<string, number>) => {
  return Object.entries(headingCounts).reduce(
    (acc: string | null, [level, count]) =>
      acc === null ||
      count > headingCounts[parseInt(acc)] ||
      (count === headingCounts[parseInt(acc)] && parseInt(level) < parseInt(acc))
        ? level
        : acc,
    null
  )
}

const splitByHeading = (pageContent: string, heading: string) => {
  const matches = [...pageContent.matchAll(REGEX_MARKDOWN_HEADERS)]
  const filteredMatches = matches.filter((match) => match[1].length === parseInt(heading))

  const sections: string[] = []
  let lastIndex = 0
  filteredMatches.forEach((match, index) => {
    // Find the position of the match in the original text
    const startPos = pageContent.indexOf(match[0], lastIndex)
    let endPos = pageContent.length
    if (index + 1 < filteredMatches.length) {
      // Find the start of the next match to define the end of the current section
      endPos = pageContent.indexOf(filteredMatches[index + 1][0], startPos)
    }
    // Extract the section from startPos to endPos
    const section = pageContent.substring(startPos, endPos).trim()
    sections.push(section)
    lastIndex = startPos
  })

  return sections
}

export const getSectionsByHeading = (pageContent: string) => {
  const headingCounts = buildHeadingCounts(pageContent)

  const mostCommonLevel = findMostCommonHeading(headingCounts)
  if (mostCommonLevel === null) {
    console.error("No headings found.")
    return []
  }

  return splitByHeading(pageContent, mostCommonLevel)
}

export const autoChunk = async (document: string, maxChunkSize: number, model: TiktokenModel) => {
  // const tokenizer = encoding_for_model(model);
  // const documentTokens = tokenizer.encode(document);
  const documentSize = documentTokens.length

  const K = Math.ceil(documentSize / maxChunkSize)
  const averageChunkSize = Math.ceil(documentSize / K)
  const shorterChunkNumber = K * averageChunkSize - documentSize
  const standardChunkNumber = K - shorterChunkNumber

  let chunkStart = 0
  const chunks: string[] = []
  for (let i = 0; i < K; i++) {
    let chunkEnd: number
    if (i < standardChunkNumber) {
      chunkEnd = chunkStart + averageChunkSize
    } else {
      chunkEnd = chunkStart + averageChunkSize - 1
    }

    const chunk = documentTokens.slice(chunkStart, chunkEnd)
    const decodedChunk = tokenizer.decode(chunk).toString()
    chunks.push(decodedChunk)
    chunkStart = chunkEnd
  }

  if (chunkStart !== documentSize) throw new Error("Chunking did not cover the entire document.")

  return { chunks: chunks, chunkSize: averageChunkSize }
}
