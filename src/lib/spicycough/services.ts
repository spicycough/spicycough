import type { APIRoute } from "astro"
import { z } from "astro:content"

const createContentItemRequestSchema = z.object({
  url: z.string().url(),
})

export const handleRequest: APIRoute = async ({ request }): Promise<Response> => {
  const data = await request.json()

  const parsedData = createContentItemRequestSchema.safeParse(data)
  if (parsedData.success === false) {
    return new Response(JSON.stringify({ errors: parsedData.error }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
