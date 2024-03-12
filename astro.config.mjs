import cloudflare from "@astrojs/cloudflare"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  adapter: cloudflare(),
  site: process.env.SITE_URL || "https://spicycough.com",
  compressHTML: true,
  output: "server",
  prefetch: true,
  experimental: { contentCollectionCache: true },
})
