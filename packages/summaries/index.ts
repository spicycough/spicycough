import { summarize } from "./src/summaries"
import { getPageContent, nhm } from "./src/utils"

type CreateSummaryParams =
  | {
      url: string
      html?: never
    }
  | {
      url?: never
      html: string
    }

export const createSummary = async (params: CreateSummaryParams) => {
  const html = params.url ? (await getPageContent(params.url)).join("\n\n") : params.html
  const pageContent = nhm.translate(html)
  return await summarize({ text: pageContent })
}

// const _url = "https://theconversation.com/mounting-research-shows-that-covid-19-leaves-its-mark-on-the-brain-including-with-significant-drops-in-iq-scores-224216";
