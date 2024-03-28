import cloudflare from "@astrojs/cloudflare"
import db from "@astrojs/db"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://spicycough.com",
  output: "server",
  compressHTML: true,
  prefetch: true,
  redirects: {
    "/": "/coming-soon",
  },
  integrations: [
    db(),
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
  ],
  adapter: cloudflare({
    mode: "directory",
    imageService: "passthrough",
    runtime: {
      mode: "local",
      type: "pages",
    },
  }),
})
