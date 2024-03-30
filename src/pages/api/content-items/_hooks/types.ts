import type OpenAI from "openai"
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions"

export type SummaryParams = {
  text: string[]
  modelOptions: Omit<ChatCompletionCreateParamsBase, "messages">
  requestOptions?: OpenAI.RequestOptions
  maxTokens?: number
}
