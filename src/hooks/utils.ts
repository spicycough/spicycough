import { decode } from "html-entities"
import userAgents from "top-user-agents"
import uniqueRandomArray from "unique-random-array"
import { generateErrorJSONResponse } from "./errors"

import fileExtension from "file-extension"
import { types } from "./constants"
import type { LinkType } from "./types"

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

export const typeChecker = (path: string): LinkType | undefined => {
  try {
    const url = new URL(path)
    const hostname = url.hostname.replace("www.", "")
    return types[hostname]
  } catch (err) {
    // swallow the error, no need to do anything
  }

  const extension = fileExtension(path)
  if (extension) {
    return types[extension]
  }

  return undefined
}

export const getLinkType = (link: string, isReaderable?: boolean): LinkType => {
  const urlIsKnownFileType = typeChecker(link)
  if (urlIsKnownFileType) {
    return urlIsKnownFileType
  }

  if (isReaderable) {
    return "article"
  }

  return "link"
}
