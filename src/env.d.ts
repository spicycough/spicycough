/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

import { z } from "astro:content"
import { env } from "./variables"

interface ImportMeta {
  readonly env: z.infer<typeof env>
}
