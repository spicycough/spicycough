import fileExtension from "file-extension"
import { types } from "./types"
import uniqueRandomArray from "unique-random-array"
import userAgents from "top-user-agents"

const MAX_REDIRECTS = 5

export interface FollowShortUrlResponse {
  urls: string[]
  unshortened_url: string
}
// This function follows a short URL and returns the final URL, use https://t.co/wy9S5P0Cd2 as an example.
export const followShortUrl = async (
  urls: string[],
  redirectCount = 0
): Promise<FollowShortUrlResponse> => {
  const url = urls.at(urls.length - 1)
  if (url === undefined) {
    throw new Error("No URLs provided.")
  }

  const fetchResponse = await fetch(new URL(url), {
    headers: {
      referrer: "http://www.google.com/",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    method: "HEAD",
    redirect: "manual",
  })

  if (redirectCount >= MAX_REDIRECTS) {
    throw new Error("Maximum redirects exceeded.")
  }
  if (fetchResponse.headers.get("location")) {
    urls.push(fetchResponse.headers.get("location") as string)
    await followShortUrl(urls, redirectCount + 1)
  }

  return {
    urls,
    unshortened_url: url,
  }
}

export type LinkType =
  | "link"
  | "video"
  | "audio"
  | "recipe"
  | "image"
  | "document"
  | "article"
  | "game"
  | "book"
  | "event"
  | "product"
  | "note"
  | "file"
export type TypeDictionary = Record<string, LinkType>
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

export const linkType = (link: string, isReaderable?: boolean): LinkType => {
  const urlIsKnownFileType = typeChecker(link)
  if (urlIsKnownFileType) {
    return urlIsKnownFileType
  }

  if (isReaderable) {
    return "article"
  }

  return "link"
}

export const randomUserAgent = uniqueRandomArray<string>(userAgents)
