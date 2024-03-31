import { match } from "ts-pattern"
import type { SummaryParams } from "./types"
import { useChainOfDensitySummary } from "./useChainOfDensitySummary"
import { useExtractiveSummary } from "./useExtractiveSummary"
import { useTokenizer } from "./useTokenizer"

type UseSummaryParams = Omit<SummaryParams, "text"> & { text: string | string[] }

export const useSummary = async (params?: UseSummaryParams & { shouldCompact?: boolean }) => {
  if (!params?.text) {
    return null
  }
  const text = Array.isArray(params?.text) ? params?.text : [params?.text]

  const { tokenize } = useTokenizer()
  const { summarize: chainOfDensitySummary } = useChainOfDensitySummary()
  const { summarize: extractiveSummary } = useExtractiveSummary()

  const tokens = await tokenize(text.join("\n"))
  const summary = await match(tokens.length)
    // Short length, use chain of density
    .when(
      (t) => t < 3800,
      async () => {
        const summary = await chainOfDensitySummary({ ...params, text })
        return summary
      }
    )
    // Medium length, use extractive summary with optional dense summary
    .when(
      (t) => t < 30000,
      async () => {
        const summary = await extractiveSummary({ ...params, text })
        return params?.shouldCompact ? await chainOfDensitySummary({ text: [summary] }) : summary
      }
    )
    .otherwise(async () => {
      return undefined
    })

  return summary
}
