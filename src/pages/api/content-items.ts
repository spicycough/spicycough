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
  const summary = await createSummary({ html: body })

  const { id, ...contentItem } = await db
    .insert(ContentItem)
    .values({
      id: nanoid(),
      kind: "article",
      author: metadata.author,
      publishedDate: new Date(metadata.date),
      description: metadata.description,
      image: metadata.image,
      lang: metadata.lang,
      logo: metadata.logo,
      publisher: metadata.publisher,
      title: metadata.title,
      url: metadata.url,
      slug: metadata.title.toLowerCase().replace(/\s/g, "-"),
    })
    .returning()
    .get()

  console.log({ id, ...contentItem })

  const { contentItemId: _, ...contentItemSummary } = await db
    .insert(ContentItemSummary)
    .values({
      contentItemId: id,
      type: "article",
      summary,
    })
    .returning()
    .get()

  console.log({ contentItemId: id, ...contentItemSummary })

  return new Response(
    JSON.stringify({
      ...{ contentItemId: id },
      ...contentItem,
      ...contentItemSummary,
    }),
    { status: 200 }
  )
}

// const queries = Object.fromEntries(
//   metadata
//     .map((meta) =>
//       match(meta)
//         // opengraph
//         .with({ name: "og:description" }, ({ value }) => ["ogDescription", value])
//         .with({ name: "og:image" }, ({ value }) => ["ogImage", value])
//         .with({ name: "og:site_name" }, ({ value }) => ["ogSiteName", value])
//         .with({ name: "og:title" }, ({ value }) => ["ogTitle", value])
//         .with({ name: "og:type" }, ({ value }) => ["ogType", value])
//         .with({ name: "og:updated_time" }, ({ value }) => ["ogUpdatedTime", new Date(value)])
//         .with({ name: "og:url" }, ({ value }) => ["ogUrl", value])
//         // twt
//         .with({ name: "twitter:card" }, ({ value }) => ["twtCard", value])
//         .with({ name: "twitter:creator" }, ({ value }) => ["twtCreator", value])
//         .with({ name: "twitter:site" }, ({ value }) => ["twtSite", value])
//         // facebook
//         .with({ name: "fb:app_id" }, ({ value }) => ["fbAppId", value])
//         .with({ name: "fb:pages" }, ({ value }) => ["fbPages", value])
//         .otherwise(() => undefined)
//     )
//     .filter(Boolean)
// )

// await db.insert(ContentItem).values(
