import { useSummary } from "@/hooks/useSummary"
import type { APIRoute } from "astro"
import { ContentItem, ContentItemSummary, db } from "astro:db"

import { useScrape } from "@/hooks/useScrape"

import { z } from "astro:content"
import { nanoid } from "nanoid"
import { P, match } from "ts-pattern"

const newContentItemSchema = z.object({
  url: z.string().url(),
  shouldCleanUrl: z.boolean().optional().default(true),
})

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()

  const parsedData = newContentItemSchema.safeParse(data)
  if (parsedData.success === false) {
    return new Response(JSON.stringify({ errors: parsedData.error }), { status: 400 })
  }

  const { url, shouldCleanUrl } = parsedData.data

  const { content, text } = await useScrape({ url, actions: "both", shouldCleanUrl })

  const { metadata } = content
  if (!metadata) {
    return new Response(
      JSON.stringify({ error: "No metadata could be extracted from the content." }),
      { status: 400 }
    )
  }

  const cleanedData: Record<string, string> = {}
  for (const key in metadata) {
    cleanedData[key] = match(metadata[key])
      .with(P.string, (val) => val.trim())
      .with(P.array(P.string), (val) => val.join(", "))
      .with(P.any, (val) => JSON.stringify(val))
      .exhaustive()
  }

  const summary = await useSummary({ text })
  if (!summary) {
    return new Response(
      JSON.stringify({ error: "No summary could be generated from the content." }),
      { status: 400 }
    )
  }

  const { id, ...contentItem } = await db
    .insert(ContentItem)
    .values({
      id: nanoid(),
      kind: "article",
      url: cleanedData.url ?? "",
      author: cleanedData.author ?? "",
      publishedDate:
        cleanedData.date && typeof metadata.date === "string"
          ? new Date(metadata?.date)
          : new Date(),
      description: cleanedData.description ?? "",
      imageUrl: cleanedData.image ?? "",
      lang: cleanedData.lang ?? "",
      logo: cleanedData.logo ?? "",
      publisher: cleanedData.publisher ?? "",
      title: cleanedData.title ?? "",
      slug:
        (typeof cleanedData.title === "string" &&
          cleanedData.title.toLowerCase()?.replace(/\s/g, "-")) ||
        "",
    })
    .returning()
    .get()

  const { contentItemId: _, ...contentItemSummary } = await db
    .insert(ContentItemSummary)
    .values({
      contentItemId: id,
      type: "article",
      summary: summary,
    })
    .returning()
    .get()

  const payload = JSON.stringify({
    ...{ contentItemId: id },
    ...contentItem,
    ...contentItemSummary,
  })

  return new Response(payload, { status: 200 })
}
