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
    "*": {
      status: 307,
      destination: "/coming-soon",
    },
  },
  integrations: [
    db(),
    icon(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "passthrough",
    wasmModuleImports: true,
  }),
})
