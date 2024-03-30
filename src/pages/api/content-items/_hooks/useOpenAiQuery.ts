import OpenAI from "openai"
import type { ChatCompletionCreateParams } from "openai/resources/chat/completions"
import { match } from "ts-pattern"

import { z } from "astro:content"

export const createChatResponseSchema = <T extends z.ZodType>(schema: T) => {
  return z.object({
    id: z.string(),
    object: z.literal("chat.completion"),
    model: z.enum([
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-0125",
      "gpt-3.5-turbo-0301",
      "gpt-3.5-turbo-0613",
      "gpt-3.5-turbo-1106",
      "gpt-3.5-turbo-16k",
      "gpt-3.5-turbo-16k-0613",
      "gpt-4",
      "gpt-4-0125-preview",
      "gpt-4-0314",
      "gpt-4-0613",
      "gpt-4-1106-preview",
      "gpt-4-32k",
      "gpt-4-32k-0314",
      "gpt-4-32k-0613",
      "gpt-4-turbo-preview",
      "gpt-4-vision-preview",
    ]),
    usage: z.object({
      prompt_tokens: z.number().positive(),
      completion_tokens: z.number().positive(),
      total_tokens: z.number().positive(),
    }),
    choices: z
      .array(
        z.object({
          index: z.number().nonnegative(),
          message: z.object({
            role: z.enum(["user", "system", "assistant", "tool", "function"]),
            content: schema,
          }),
          finish_reason: z.enum([
            "stop",
            "content_filter",
            "function_call",
            "length",
            "tool_calls",
          ]),
        })
      )
      .min(1, { message: "No choices found" }),
    system_fingerprint: z.string(),
    created: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === "invalid_date" ? "That's not a date!" : defaultError,
      }),
    }),
  })
}

export type ChatCompletionResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof createChatResponseSchema<T>>
>

interface UseOpenAiQueryParams<TContentSchema extends z.ZodType> {
  prompt: string
  schema: TContentSchema
  model?: ChatCompletionCreateParams["model"]
  apiKey?: string
  role?: "user" | "system" | "assistant"
  type?: "text" | "json"
}

export const useOpenAiQuery = async <T extends z.ZodTypeAny>(params: UseOpenAiQueryParams<T>) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const responseSchema = createChatResponseSchema<T>(params.schema)

  const resp = await openai.chat.completions.create({
    model: params.model ?? "gpt-3.5-turbo",
    messages: [{ role: params.role ?? "system", content: params.prompt }],
    response_format: {
      type: match(params.type)
        .returnType<ChatCompletionCreateParams.ResponseFormat["type"]>()
        .with("json", () => "json_object")
        .otherwise(() => "text"),
    },
  })

  const parsedData = await responseSchema.safeParseAsync(resp)
  if (parsedData.success === false) {
    throw new Error(`Invalid response: \n${parsedData.error.message}`)
  }

  const { data } = parsedData

  const response = {
    id: data.id,
    model: data.model,
    content: data.choices?.flatMap((choice) => choice?.message?.content),
    data: data,
    rawResponse: resp,
    response: parsedData,
  }

  return response
}
