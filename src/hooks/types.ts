import type OpenAI from "openai"
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions"
import type { scraperRules, textRules } from "./constants"

export type SummaryParams = {
  text: string[]
  modelOptions: Omit<ChatCompletionCreateParamsBase, "messages">
  requestOptions?: OpenAI.RequestOptions
  maxTokens?: number
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

export type GetValueOption = { selector: string; attribute?: string }

export type GetMetadataOptions<TName extends string = string> = {
  name: TName
  selectors: GetValueOption[]
  multiple: boolean
}

export type Matches = Record<
  Partial<(typeof scraperRules)[number]["name"] | string>,
  string | string[]
>

export type GetTextContentOptions<TName extends string = string> = {
  name: TName
  selectors: GetValueOption[]
  multiple: boolean
}

export type Sections = Record<
  Partial<(typeof textRules)[number]["name"] | string>,
  string | string[]
>

// type ScrapeMetadataResponse = string | string[] | JSON

// type ScrapeTextResponse = string | string[] | JSON

// type S = {
//   rewriter: HTMLRewriter
//   url: string
//   response: Response
//   metadata: ScrapeMetadataResponse
//   text: ScrapeTextResponse
//   unshortenedInfo: FollowShortUrlResponse
// }
