import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  prefetch: true,
  adapter: cloudflare(),
  experimental: { contentCollectionCache: true },
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
