import cloudflare from "@astrojs/cloudflare"
import db from "@astrojs/db"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://spicycough.com",
  output: "server",
  compressHTML: true,
  prefetch: true,
  integrations: [db(), tailwind({ applyBaseStyles: false })],
  adapter: cloudflare({
    mode: "directory",
    imageService: "passthrough",
    runtime: { mode: "local", type: "pages" },
  }),
})
