import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://spicycough.com",
  integrations: [tailwind(), alpinejs()],
  prefetch: true,
  experimental: {
    contentCollectionCache: true
  },
  output: "server",
  adapter: cloudflare()
});