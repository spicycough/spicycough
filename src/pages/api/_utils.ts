import { decode } from "html-entities"
import uniqueRandomArray from "unique-random-array"
import userAgents from "top-user-agents"
import { generateErrorJSONResponse } from "./_errors"

export const cleanText = (string: string) => {
  return decode(string.trim(), { level: "html5" })
}

export const randomUserAgent = uniqueRandomArray<string>(userAgents)

export const prepareUrl = (url: string): URL => {
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
