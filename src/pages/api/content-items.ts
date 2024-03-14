import type { APIRoute } from "astro"
import * as semantics from "@/lib/web/semantics"
import * as utils from "@/lib/web/html"
import * as fs from "fs"

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
  const metadata = await utils.getMeta({ url })
  console.log(metadata)

  // fs.writeFileSync(`./testdata/${nanoid()}.html`, pageContent.join("\n"))

  return new Response(
    JSON.stringify({
      url,
      content: metadata,
    }),
    { status: 200 }
  )
}
