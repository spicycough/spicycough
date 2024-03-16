// import type { TiktokenModel } from "tiktoken"
// import { encoding_for_model } from "tiktoken"

const REGEX_MARKDOWN_HEADERS = /^(#{1,4})\s+(.*)/gm // 'g' for global, 'm' for multiline

export const chunkByHeading = ({ pageContent }: { pageContent: string }) => {
  const headings = pageContent.match(REGEX_MARKDOWN_HEADERS)

  const headingLevels = headings.map((heading) => {
    const match = heading.match(/^#{1,4}/)
    return match ? match[0].length : 0
  })

  const headingCounts = headingLevels.reduce(
    (acc, level) => {
      acc[level] = (acc[level] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const mostCommonHeading = Object.entries(headingCounts).reduce(
    (acc: string | null, [level, count]) => {
      return acc === null ||
        count > headingCounts[Number.parseInt(acc)] ||
        (count === headingCounts[Number.parseInt(acc)] &&
          Number.parseInt(level) < Number.parseInt(acc))
        ? level
        : acc
    },
    null
  )

  if (mostCommonHeading === null) {
    console.error("No headings found.")
    return { chunks: [] }
  }

  const matches = [...pageContent.matchAll(REGEX_MARKDOWN_HEADERS)]
  const filteredMatches = matches.filter(
    (match) => match[1].length === Number.parseInt(mostCommonHeading)
  )

  let lastIndex = 0
  const sections: string[] = []
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

  return { chunks: sections }
}

// export const chunkByTokens = async (
//   document: string,
//   maxChunkSize: number,
//   model: any, // TiktokenModel
// ) => {
//   const tokenizer = encoding_for_model(model)
//   const documentTokens = tokenizer.encode(document)
//   const documentSize = documentTokens.length

//   const K = Math.ceil(documentSize / maxChunkSize)
//   const averageChunkSize = Math.ceil(documentSize / K)
//   const shorterChunkNumber = K * averageChunkSize - documentSize
//   const standardChunkNumber = K - shorterChunkNumber

//   let chunkStart = 0
//   const chunks: string[] = []
//   for (let i = 0; i < K; i++) {
//     let chunkEnd: number
//     if (i < standardChunkNumber) {
//       chunkEnd = chunkStart + averageChunkSize
//     } else {
//       chunkEnd = chunkStart + averageChunkSize - 1
//     }

//     const chunk = documentTokens.slice(chunkStart, chunkEnd)
//     const decodedChunk = tokenizer.decode(chunk).toString()
//     chunks.push(decodedChunk)
//     chunkStart = chunkEnd
//   }

//   if (chunkStart !== documentSize) {
//     console.error("Chunking did not cover the entire document.")
//     return { chunks: [] }
//   }

//   return { chunks: chunks }
// }
