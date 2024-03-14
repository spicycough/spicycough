import cloudflare from "@astrojs/cloudflare"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"
import db from "@astrojs/db"

export default defineConfig({
  site: process.env.SITE_URL || "https://spicycough.com",
  output: "server",
  integrations: [db(), tailwind({ applyBaseStyles: false })],
  adapter: cloudflare({
    mode: "directory",
    imageService: "passthrough",
    runtime: { mode: "local", type: "pages" },
  }),
  compressHTML: true,
  prefetch: true,
})
