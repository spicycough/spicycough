// import { summarize } from "./summaries"
// import { fetchPageContent, nhm } from "./html"

export { summarize } from "./summaries"

// type CreateSummaryParams =
//   | {
//       url: string
//       html?: never
//     }
//   | {
//       url?: never
//       html: string
//     }

// export const createSummary = async (params: CreateSummaryParams) => {
//   const html = params?.url ? await fetchPageContent({ url: params.url }) : params?.html
//   if (!html) return null
//   const pageContent = nhm.translate(html)
//   return await summarize({ text: pageContent })
// }
