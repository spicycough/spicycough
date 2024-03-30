import { z } from "astro:content"
import { useOpenAiQuery } from "./useOpenAiQuery"
import type { SummaryParams } from "./types"

const buildKeywordPrompt = (text: string) => {
  return `Text: \n${text}

You are an efficient keyword detector. Your task is to extract only all the important keywords and phrases without any duplicates from the above text.
Think "step-by step" to identify and all the important keywords and pharses only and output should be comma seperated.`
}

const keywordSchema = z.preprocess((str, ctx) => {
  if (typeof str !== "string") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expected a comma-separated string",
      fatal: true,
    })
    return z.NEVER
  }
  return str.split(",")
}, z.array(z.string()))

const buildExtractivePrompt = (text: string, keywords: string[]) => {
  const flatKeywords = keywords.flat(1).join(", ")
  return `Text: \n${text}

Important keywords: ${flatKeywords}

You are an expert text summarizer. Given the above text content and the important key words, write a concise but information loaded summary.
Think "step-by-step" how to utilize both the important keywords and text content to create a great concise summary.`
}

const buildFinalPrompt = (summaries: string[]) => {
  const flatSummaries = summaries.flat(1).join("\n\n")
  return `Summaries: \n${flatSummaries}

Thinking "step-by-step", take the above summaries and distill them into one final, consolidated summary.`
}

// Medium-form summary
export const extractiveSummary = async ({ text, ...params }: SummaryParams) => {
  const summaries: string[] = new Array(text.length)
  for (const chunk of text) {
    const { content: keywords } = await useOpenAiQuery({
      prompt: buildKeywordPrompt(chunk),
      schema: keywordSchema,
      ...params,
    })
    if (!keywords?.[0]) {
      continue
    }

    const { content: summary } = await useOpenAiQuery({
      prompt: buildExtractivePrompt(chunk, keywords[0]),
      schema: z.string(),
      ...params,
    })
    if (summary?.[0]) {
      summaries.push(summary[0])
    }
  }

  const { content: finalSummary } = await useOpenAiQuery({
    prompt: buildFinalPrompt(summaries),
    schema: z.string(),
  })

  return finalSummary.flat(1).join("\n")
}

export const useExtractiveSummary = (params?: SummaryParams) => {
  const defaultModelOptions = {
    model: "gpt-3.5-turbo",
    frequency_penalty: 0,
    max_tokens: 500,
    presence_penalty: 0,
    temperature: 0.3,
    top_p: 1.0,
  }

  const { modelOptions, ...rest } = params || {}

  return {
    summarize: ({ text }: { text: string[] }) =>
      extractiveSummary({
        ...rest,
        text: text,
        modelOptions: {
          ...defaultModelOptions,
          ...modelOptions,
        },
      }),
  }
}
