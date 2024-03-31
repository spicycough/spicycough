import { useSummary } from "@/hooks/useSummary"
import type { APIRoute } from "astro"
import { ContentItem, ContentItemSummary, db } from "astro:db"

import { useScrape } from "@/hooks/useScrape"

import { z } from "astro:content"
import { nanoid } from "nanoid"

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

  const { text, metadata } = await useScrape({ url, actions: "both", shouldCleanUrl })

  if (!text) {
    return new Response(JSON.stringify({ error: "No text could be extracted from the content." }), {
      status: 400,
    })
  }

  if (!metadata) {
    return new Response(
      JSON.stringify({ error: "No metadata could be extracted from the content." }),
      { status: 400 }
    )
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
      url: metadata.url ?? "",
      author: metadata.author ?? "",
      publishedDate:
        metadata.date && typeof metadata.date === "string" ? new Date(metadata?.date) : new Date(),
      description: metadata.description ?? "",
      imageUrl: metadata.image ?? "",
      lang: metadata.lang ?? "",
      logo: metadata.logo ?? "",
      publisher: metadata.publisher ?? "",
      title: metadata.title ?? "",
      slug:
        (typeof metadata.title === "string" && metadata.title.toLowerCase()?.replace(/\s/g, "-")) ||
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
