import cloudflare from "@astrojs/cloudflare"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"
import db from "@astrojs/db"

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://spicycough.com",
  output: "hybrid",
  compressHTML: true,
  prefetch: true,
  integrations: [db(), tailwind({ applyBaseStyles: false })],
  adapter: cloudflare({
    mode: "directory",
    imageService: "passthrough",
    runtime: { mode: "local", type: "pages" },
  }),
})
