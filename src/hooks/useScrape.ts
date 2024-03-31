import { NodeHtmlMarkdown } from "node-html-markdown"
import { TidyURL } from "tidy-url"
import { match, P } from "ts-pattern"
import { scraperRules, textRules } from "./constants"
import type { GetMetadataOptions, GetTextContentOptions, Matches, Sections } from "./types"
import { cleanText, getLinkType, prepareUrl, safeFetch } from "./utils"

const getText = async (options: GetTextContentOptions[]) => {
  const response = new Response()
  const rewriter = new HTMLRewriter()

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
      rewriter.on(selector, {
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

  const transformed = rewriter.transform(response)
  await transformed.arrayBuffer()

  const json = JSON.stringify(sections)

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
  return nhm.translate(json)
}

const getMetadata = async (options: GetMetadataOptions[]) => {
  const response = new Response()
  const rewriter = new HTMLRewriter()

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

      rewriter.on(selector, {
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

  const transformed = rewriter.transform(response)
  await transformed.arrayBuffer()

  const metadata: Record<string, string> = {}
  for (const key in matches) {
    metadata[key] = match(matches[key])
      .with(P.string, (val) => val.trim())
      .with(P.array(P.string), (val) => val.join(", "))
      .with(P.any, (val) => JSON.stringify(val))
      .exhaustive()
  }
  return metadata
}

type UseScapeParams = {
  actions: "text" | "metadata" | "both"
  url: string
  shouldCleanUrl?: boolean
  shouldFetchJsonLd?: boolean
}

export const useScrape = async ({
  shouldCleanUrl = true,
  shouldFetchJsonLd,
  ...params
}: UseScapeParams) => {
  const preparedUrl = prepareUrl(params.url)
  const response = await safeFetch(preparedUrl.toString())

  const content = await match(params.actions)
    .with("both", async () => {
      const metadata = await getMetadata(scraperRules)
      if (shouldFetchJsonLd) {
        // const json = await response.json()
        // if (json.jsonld) {
        //   const jsonld = JSON.parse(json?.jsonld)
        // }
      }
      const text = await getText(textRules)
      return { text, metadata }
    })
    .with("text", async () => {
      const text = await getText(textRules)
      return { text, metadata: null }
    })
    .with("metadata", async () => {
      const metadata = await getMetadata(scraperRules)
      return { text: null, metadata }
    })
    .exhaustive()

  let url: string
  if (shouldCleanUrl) {
    url = TidyURL.clean(params.url).url
  } else {
    url = response.url
  }

  const urlType = getLinkType(url, false)

  return {
    ...content,
    response,
    urlType,
  }
}
