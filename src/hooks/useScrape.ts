import { NodeHtmlMarkdown } from "node-html-markdown"
import { TidyURL } from "tidy-url"
import { match } from "ts-pattern"
import { safeFetch } from "./_fetch"
import { scraperRules, textRules } from "./constants"
import type { GetMetadataOptions, GetTextContentOptions, Matches, Sections } from "./types"
import { cleanText, getLinkType, prepareUrl } from "./utils"

const getText = async (options: GetTextContentOptions[]): Promise<string> => {
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

const getMetadata = async (options: GetMetadataOptions[]): Promise<Matches> => {
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

  return matches
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

  const content = match(params.actions)
    .with("text", async () => {
      const text = await getText(textRules)
      return { text }
    })
    .with("metadata", async () => {
      const metadata = await getMetadata(scraperRules)
      return { metadata }
    })
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

  let url: string
  if (shouldCleanUrl) {
    url = TidyURL.clean(params.url).url
  } else {
    url = response.url
  }

  const urlType = getLinkType(url, false)

  return {
    content,
    response,
    urlType,
  }
}
