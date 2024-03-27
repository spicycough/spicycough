import { TidyURL } from "tidy-url"
import { Scraper, scraperRules } from "./scraper"
import { linkType } from "./utils"

export { Scraper, scraperRules } from "./scraper"
export { linkType } from "./utils"

type ScrapeRequest = {
  url: string
  shouldCleanUrl?: boolean | undefined
}

type ErrorWithMessage = {
  message: string
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError
  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

export const getErrorMessage = (error: unknown) => {
  console.log("🚀 ~ getErrorMessage ~ error:", error)
  return toErrorWithMessage(error).message
}

export const generateErrorJSONResponse = (error: unknown, url?: string) => {
  const errorMessage = getErrorMessage(error)
  return JSON.stringify({
    error: errorMessage,
    url,
  })
}

const prepareUrl = (url: string): URL => {
  if (!url) {
    const error = "Please provide a `url` query parameter, e.g. ?url=https://example.com"
    throw generateErrorJSONResponse(error, url)
  }

  try {
    const requestedUrl = new URL(url && !url.match(/^[a-zA-Z]+:\/\//) ? `https://${url}` : url)

    // If the url is a reddit url, use old.reddit.com because it has much
    // more information when scraping
    if (url.includes("reddit.com")) {
      requestedUrl.hostname = "old.reddit.com"
    }
    return requestedUrl
  } catch (error) {
    throw generateErrorJSONResponse(error, url)
  }
}

export const scrape = async ({ url, shouldCleanUrl = true }: ScrapeRequest) => {
  const scraper = new Scraper()
  let response = null

  const preparedUrl = prepareUrl(url)

  await scraper.fetch(preparedUrl.toString())

  try {
    response = await scraper.getMetadata(scraperRules)

    const unshortenedUrl = scraper.response.url

    if (shouldCleanUrl) {
      const cleanedUrl = TidyURL.clean(unshortenedUrl || url)
      response.cleaned_url = cleanedUrl.url
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
