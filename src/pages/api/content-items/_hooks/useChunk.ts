import { encodingForModel, type TiktokenModel } from "js-tiktoken"
import { match, P } from "ts-pattern"

type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6

const buildRegex = (params?: ByHeadingOptions) => {
  const regex = match(params)
    .with({ type: "level" }, ({ args }) => `^#{${args}}\\s+(.*)`)
    .with({ type: "range" }, ({ args }) => `#{${args.start},${args.end}}`)
    .otherwise(() => "#{1,4}")
  return new RegExp(`^(${regex})\\s+(.*)`, "gm")
}

type ByHeadingOptions =
  | {
      type: "level"
      args: HeaderLevel
    }
  | {
      type: "range"
      args: {
        start: HeaderLevel
        end: HeaderLevel
      }
    }

type ByHeadingParams = {
  text: string
  options: ByHeadingOptions
}

/**
 * Chunk the text into smaller sections by markdown headers.
 */
export const chunkByHeading = async ({ text, options }: ByHeadingParams) => {
  const regex = buildRegex(options)
  const headings = text.match(regex)

  if (!headings) {
    console.error("No headings found.")
    return { chunks: [] }
  }

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

  let mostCommonHeading = null
  let highestCount = 0
  for (const [level, count] of Object.entries(headingCounts)) {
    if (
      mostCommonHeading === null ||
      count > highestCount ||
      (count === highestCount && Number.parseInt(level) < Number.parseInt(mostCommonHeading))
    ) {
      mostCommonHeading = level
      highestCount = count
    }
  }

  if (mostCommonHeading === null) {
    console.error("No headings found.")
    return { chunks: [] }
  }

  const matches = [...text.matchAll(regex)]
  const filteredMatches = matches.filter(
    (match) => match[1]?.length === Number.parseInt(mostCommonHeading)
  )

  let lastIndex = 0
  const sections: string[] = []
  filteredMatches.forEach((match, index) => {
    // Find the position of the match in the original text
    const startPos = text.indexOf(match[0], lastIndex)
    let endPos = text.length
    if (index + 1 < filteredMatches.length) {
      // Find the start of the next match to define the end of the current section
      const filteredMatch = filteredMatches[index + 1]
      if (filteredMatch !== undefined) {
        endPos = text.indexOf(filteredMatch[0], startPos)
      }
    }
    // Extract the section from startPos to endPos
    const section = text.substring(startPos, endPos).trim()
    sections.push(section)
    lastIndex = startPos
  })

  return { chunks: sections }
}

type ByTokensOptions = {
  maxChunkSize: number
  model: TiktokenModel
}

type ByTokensParams = {
  text: string
  options: ByTokensOptions
}

export const chunkByTokens = async ({ text, options }: ByTokensParams) => {
  const tokenizer = encodingForModel(options.model)
  const documentTokens = tokenizer.encode(text)
  const documentSize = documentTokens.length

  const K = Math.ceil(documentSize / options.maxChunkSize)
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

  if (chunkStart !== documentSize) {
    console.error("Chunking did not cover the entire document.")
    return { chunks: [] }
  }

  return { chunks: chunks }
}

type UseChunkParams = {
  text: string
  method: "auto" | "token"
  options?: Partial<ByTokensOptions> | Partial<ByHeadingOptions>
}

export const useChunk = (params: UseChunkParams) => {
  const defaultOptions = {
    token: {
      type: "range",
      args: { start: 1, end: 4 },
    },
    heading: {
      model: "gpt-3.5-turbo",
      maxChunkSize: 500,
    },
  }

  return match(params)
    .with(
      {
        method: "token",
        options: { maxChunkSize: P.number, model: P.string },
      },
      async (p) => {
        return await chunkByTokens({
          text: p.text,
          options: {
            ...defaultOptions.token,
            ...p.options,
          },
        })
      }
    )
    .with(
      {
        method: "auto",
        options: P.union(
          { type: "level", args: P.number },
          { type: "range", args: { start: P.number, end: P.number } }
        ),
      },
      async (p) => {
        return await chunkByHeading({
          text: p.text,
          options: {
            ...defaultOptions.heading,
            ...p.options,
          },
        })
      }
    )
}
