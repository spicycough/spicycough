import { Scraper, linkType, scraperRules } from "@/lib/scraper"
import type { APIRoute } from "astro"
import { TidyURL } from "tidy-url"

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

export const generateJSONResponse = (obj: any) => {
  return new Response(JSON.stringify(obj), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

export const generateErrorJSONResponse = (error: unknown, url?: string) => {
  const errorMessage = getErrorMessage(error)
  return generateJSONResponse({
    error: errorMessage,
    url,
  })
}

export type ScrapeResponse = string | string[] | JSON

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  const searchParams = new URL(request.url).searchParams
  const scraper = new Scraper()
  let response: Record<string, ScrapeResponse>
  let url = searchParams.get("url")
  const cleanUrl = searchParams.get("cleanUrl")

  if (!url) {
    return generateErrorJSONResponse(
      "Please provide a `url` query parameter, e.g. ?url=https://example.com"
    )
  }

  if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
    url = `https://${url}`
  }

  try {
    const requestedUrl = new URL(url)

    // If the url is a reddit url, use old.reddit.com because it has much
    // more information when scraping
    if (url.includes("reddit.com")) {
      requestedUrl.hostname = "old.reddit.com"
      url = requestedUrl.toString()
    }

    await scraper.fetch(url)
  } catch (error) {
    return generateErrorJSONResponse(error, url)
  }

  try {
    response = await scraper.getMetadata(scraperRules)

    const unshortenedUrl = scraper.response.url

    if (cleanUrl) {
      const cleanedUrl = TidyURL.clean(unshortenedUrl || url)
      response.cleaned_url = cleanedUrl.url
    }

    response.url = unshortenedUrl

    response.urlType = linkType(url, false)

    if (response?.jsonld) {
      response.jsonld = JSON.parse(response.jsonld as string)
    }
  } catch (error) {
    return generateErrorJSONResponse(error, url)
  }

  return generateJSONResponse(response)
}
