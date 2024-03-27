import { z } from "astro:content"

import type { TiktokenModel } from "js-tiktoken"
import { encodingForModel } from "js-tiktoken"
import { match } from "ts-pattern"

import type OpenAI from "openai"
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { request } from "./request"
import { chunkByHeading } from "./semantics"

type TSummaryInput = {
  text: string[]
  modelOptions: Omit<ChatCompletionCreateParamsBase, "messages">
  requestOptions?: OpenAI.RequestOptions
  maxTokens?: number
}

// Short-form summary
const chainOfDensitySummary = async ({ text }: TSummaryInput) => {
  const { content: summaries } = await request({
    type: "json",
    prompt: `Text: \n${text.join("\n\n")}

You will generate increasingly concise, entity-dense summaries of the above article. 

Repeat the following 2 steps 5 times. 
Step 1. Identify 1-3 informative entities (";" delimited) from the article which are missing from the previously generated summary. 
Step 2. Write a new, denser summary of identical length which covers every entity and detail from the previous summary plus the missing entities. 

A missing entity is:
- relevant to the main story, 
- specific yet concise (5 words or fewer), 
- novel (not in the previous summary), 
- faithful (present in the article), 
- anywhere (can be located anywhere in the article).

Guidelines:
- The first summary should be long (4-5 sentences, ~80 words) yet highly non-specific, containing little information beyond the entities marked as missing. Use overly verbose language and fillers (e.g., "this article discusses") to reach ~80 words.
- Make every word count: rewrite the previous summary to improve flow and make space for additional entities.
- Make space with fusion, compression, and removal of uninformative phrases like "the article discusses".
- The summaries should become highly dense and concise yet self-contained, i.e., easily understood without the article. 
- Missing entities can appear anywhere in the new summary.
- Never drop entities from the previous summary. If space cannot be made, add fewer new entities. 

Remember, use the exact same number of words for each summary.
Answer in valid JSON. The JSON should be a python list (length 5) of dictionaries whose keys are "missing_entities" and "denser_summary".`,
    schema: z.preprocess(
      (arg): arg is string => (typeof arg === "string" ? JSON.parse(arg) : arg),
      z.object({
        missing_entities: z.string(),
        denser_summary: z.string(),
      })
    ),
  })

  const finalSummary = summaries[summaries.length - 1]?.denser_summary
  return finalSummary
}

// Medium-form summary
const extractiveSummary = async ({ text }: TSummaryInput) => {
  const summarize = async (chunk: string) => {
    const { content: keywords } = await request({
      prompt: `Text: \n${chunk}

You are an efficient keyword detector. Your task is to extract only all the important keywords and phrases without any duplicates from the above text.
Think "step-by step" to identify and all the important keywords and pharses only and output should be comma seperated.`,
      schema: z.preprocess((str, ctx) => {
        if (typeof str !== "string") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Expected a comma-separated string",
            fatal: true,
          })
          return z.NEVER
        }
        return str.split(",")
      }, z.array(z.string())),
    })

    const { content: summary } = await request({
      prompt: `Text: \n${chunk}

Important keywords: ${keywords.flat(1).join(", ")}

You are an expert text summarizer. Given the above text content and the important key words, write a concise but information loaded summary.
Think "step-by-step" how to utilize both the important keywords and text content to create a great concise summary.`,
      schema: z.string(),
    })

    return summary
  }

  const summaries = await Promise.all(
    text.map(async (chunk) => {
      return await summarize(chunk)
    })
  )

  const { content: finalSummary } = await request({
    prompt: `Summaries: \n${summaries.flat(1).join("\n\n")}

Thinking "step-by-step", take the above summaries and distill them into one final, consolidated summary.`,
    schema: z.string(),
  })

  return finalSummary.flat(1).join("\n")
}

// Long-form summary
const clusterSummary = async (_: TSummaryInput) => {
  throw new Error("Not implemented")
}

type SummarizeParams = {
  text: string
  model?: TiktokenModel
}

const summarize = async ({ text, model = "gpt-3.5-turbo" }: SummarizeParams) => {
  const tokenizer = encodingForModel(model)
  const tokens = tokenizer.encode(text)

  const summary = await match(tokens.length)
    // Short length, use chain of density
    .when(
      (t) => t < 3800,
      async () => {
        return await chainOfDensitySummary({
          text: [text],
          modelOptions: {
            model: model,
            frequency_penalty: 0,
            max_tokens: 4000,
            presence_penalty: 0,
            temperature: 0.3,
            top_p: 1.0,
          },
        })
      }
    )
    // Medium length, use extractive summary
    // with optional dense summary
    .when(
      (t) => t < 30000,
      async () => {
        const finalDense = false

        const { chunks } = chunkByHeading({ pageContent: text })

        const summary = await extractiveSummary({
          text: chunks,
          modelOptions: {
            model: model,
            frequency_penalty: 0,
            max_tokens: 500,
            presence_penalty: 0,
            temperature: 0.3,
            top_p: 1.0,
          },
        })

        if (finalDense) {
          return summary
        }

        return await chainOfDensitySummary({
          text: [text],
          modelOptions: {
            model: model,
            frequency_penalty: 0,
            max_tokens: 4000,
            presence_penalty: 0,
            temperature: 0.3,
            top_p: 1.0,
          },
        })
      }
    )
    .otherwise(async () => {
      clusterSummary({
        text: [text],
        modelOptions: {
          model: model,
          frequency_penalty: 0,
          max_tokens: 500,
          presence_penalty: 0,
          temperature: 0.3,
          top_p: 1.0,
        },
      })

      return null
    })

  return summary
}

export { chainOfDensitySummary, clusterSummary, extractiveSummary, summarize }
