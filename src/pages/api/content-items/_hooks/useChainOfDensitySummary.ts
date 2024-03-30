import { z } from "astro:content"

import type { SummaryParams } from "./types"
import { useOpenAiQuery } from "./useOpenAiQuery"

const buildPrompt = (text: string) => {
  return `Text: \n${text}

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
Answer in valid JSON. The JSON should be a python list (length 5) of dictionaries whose keys are "missing_entities" and "denser_summary".`
}

const schema = z.preprocess(
  (arg): arg is string => (typeof arg === "string" ? JSON.parse(arg) : arg),
  z.object({
    missing_entities: z.string(),
    denser_summary: z.string(),
  })
)

// Short-form summary
const chainOfDensitySummary = async (params: SummaryParams) => {
  const text = params.text.join("\n\n")

  const { content: summaries } = await useOpenAiQuery({
    type: "json",
    prompt: buildPrompt(text),
    schema,
  })

  const finalSummary = summaries[summaries.length - 1]?.denser_summary
  if (!finalSummary) {
    throw new Error("No summary found")
  }

  return finalSummary
}

export const useChainOfDensitySummary = (params?: SummaryParams) => {
  const defaultModelOptions = {
    model: "gpt-3.5-turbo",
    frequency_penalty: 0,
    max_tokens: 4000,
    presence_penalty: 0,
    temperature: 0.3,
    top_p: 1.0,
  }

  const { modelOptions, ...rest } = params || {}

  return {
    summarize: ({ text }: { text: string[] }) => {
      return chainOfDensitySummary({
        ...rest,
        text,
        modelOptions: {
          ...defaultModelOptions,
          ...modelOptions,
        },
      })
    },
  }
}
