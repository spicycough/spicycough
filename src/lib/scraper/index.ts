import { TidyURL } from "tidy-url"
import { Scraper, scraperRules, textRules } from "./scraper"
import { linkType } from "./utils"
import { generateErrorJSONResponse } from "./errors"

type ScrapeRequest = {
  url: string
  shouldCleanUrl?: boolean | undefined
}

export const scrape = async ({ url, shouldCleanUrl = true }: ScrapeRequest) => {
  const scraper = new Scraper()
  // @ts-ignore
  let response: {
    cleanedUrl?: string
    url?: string
    urlType?: string
    jsonld?: string
    metadata: Record<string, unknown>
    text: string
  } = null

  const preparedUrl = prepareUrl(url)

  await scraper.fetch(preparedUrl.toString())

  try {
    response = {
      metadata: await scraper.getMetadata(scraperRules),
      text: await scraper.getTextContent(textRules),
    }

    const unshortenedUrl = scraper.response.url

    if (shouldCleanUrl) {
      const { url: cleanedUrl } = TidyURL.clean(unshortenedUrl || url)
      response.cleanedUrl = cleanedUrl
    }

    response.url = unshortenedUrl

    response.urlType = linkType(url, false)

    if (response?.jsonld) {
      response.jsonld = JSON.parse(response.jsonld as string)
    }

    return response
  } catch (error) {
    throw generateErrorJSONResponse(error, url)
  }
}

export { Scraper, scraperRules, textRules } from "./scraper"
export { linkType } from "./utils"
