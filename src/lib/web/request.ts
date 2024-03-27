import OpenAI from "openai"
import type { ChatCompletionCreateParams } from "openai/resources/chat/completions.mjs"
import { match } from "ts-pattern"

import { z } from "astro:content"

const modelsEnum = z.enum([
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
])

export const createChatResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    id: z.string(),
    object: z.literal("chat.completion"),
    model: modelsEnum,
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

export type ChatCompletionResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof createChatResponseSchema<T>>
>

type RequestParams<TContentSchema extends z.ZodTypeAny> = {
  prompt: string
  schema: TContentSchema
  model?: ChatCompletionCreateParams["model"]
  role?: "user" | "system" | "assistant"
  type?: "text" | "json"
}

export const request = async <TContentSchema extends z.ZodType>({
  prompt,
  schema,
  model = "gpt-3.5-turbo",
  role = "system",
  type = "text",
}: RequestParams<TContentSchema>) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const responseSchema = createChatResponseSchema<TContentSchema>(schema)

  const responseType = match(type)
    .returnType<ChatCompletionCreateParams.ResponseFormat["type"]>()
    .with("json", () => "json_object")
    .otherwise(() => "text")

  const resp = await openai.chat.completions.create({
    model,
    messages: [{ role, content: prompt }],
    response_format: { type: responseType ?? "text" },
  })

  const parsedResp = await responseSchema.safeParseAsync(resp)
  if (parsedResp.success === false) {
    throw new Error(`Invalid response: \n${parsedResp.error.message}`)
  }

  return {
    id: parsedResp.data.id,
    model: parsedResp.data.model,
    content: parsedResp.data.choices.flatMap((choice) => choice?.message?.content),
    data: parsedResp.data,
    rawResponse: resp,
    response: parsedResp,
  }
}
