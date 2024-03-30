import { randomUserAgent } from "./_utils"

const MAX_REDIRECTS = 5

export const safeFetch = async (url: string): Promise<Response> => {
  let unshortenedInfo: FollowShortUrlResponse
  try {
    unshortenedInfo = await followShortUrl([url])
  } catch (error) {
    throw new Error(`Unable to follow URL: ${error}`)
  }
  const response = await fetch(unshortenedInfo.unshortened_url || url, {
    headers: {
      referrer: "http://www.google.com/",
      "User-Agent": randomUserAgent(),
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  })

  const server = response.headers.get("server")

  const isThisWorkerErrorNotErrorWithinScrapedSite =
    [530, 503, 502, 403, 400].includes(response.status) &&
    (server === "cloudflare" || !server) /* Workers preview editor */

  if (isThisWorkerErrorNotErrorWithinScrapedSite) {
    throw new Error(`Status ${response.status} requesting ${url}`)
  }

  return response
}

export interface FollowShortUrlResponse {
  urls: string[]
  unshortened_url: string
}

export async function followShortUrl(
  urls: string[],
  redirectCount = 0
): Promise<FollowShortUrlResponse> {
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
