import type { APIRoute } from "astro"
import { ContentItem, db, eq } from "astro:db"

import { z } from "astro:content"

const fetchContentItemSchema = z.object({
  id: z.coerce.number().pipe(z.string()),
})

export const GET: APIRoute = async ({ params }) => {
  const parsedData = fetchContentItemSchema.safeParse({ id: params.id })
  if (parsedData.success === false) {
    return new Response(JSON.stringify({ errors: parsedData.error }), { status: 400 })
  }

  const contentItem = await db
    .select()
    .from(ContentItem)
    .where(eq(ContentItem.id, parsedData.data.id))

  return new Response(JSON.stringify(contentItem), { status: 200 })
}
