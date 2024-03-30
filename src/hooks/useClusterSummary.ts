import type { SummaryParams } from "@/hooks/types"

const clusterSummary = (_: SummaryParams) => {
  throw new Error("Not implemented")
}
export const useClusterSummary = (params: SummaryParams) => {
  return clusterSummary(params)
}
