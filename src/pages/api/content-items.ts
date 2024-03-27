import type { APIRoute } from "astro"
// import * as semantics from "@/lib/web/semantics"
import * as utils from "@/lib/web/html"
import { createSummary } from "@summaries"
import { ContentItem, ContentItemSummary, db } from "astro:db"

import { z } from "astro:content"
import { nanoid } from "nanoid"

const newContentItemSchema = z.object({
  url: z.string().url(),
})

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()

  const parsedData = newContentItemSchema.safeParse(data)
  if (parsedData.success === false) {
    return new Response(JSON.stringify({ errors: parsedData.error }), { status: 400 })
  }

  const { url } = parsedData.data

  const resp = await fetch(url)
  const body = await resp.text()

  const metadata = await utils.getMetadata({ url })
  if (!metadata) {
    return new Response(
      JSON.stringify({ error: "No metadata could be extracted from the content." }),
      { status: 400 }
    )
  }

  const summary = await createSummary({ html: body })
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
      author: metadata.author,
      publishedDate: new Date(metadata.date),
      description: metadata.description,
      imageUrl: metadata.image,
      lang: metadata.lang,
      logo: metadata.logo,
      publisher: metadata.publisher,
      title: metadata.title,
      url: metadata.url,
      slug: metadata.title.toLowerCase().replace(/\s/g, "-"),
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
