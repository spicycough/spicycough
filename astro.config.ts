import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://spicycough.com",
	output: "server",
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
	],
	adapter: cloudflare({
		mode: "directory",
		imageService: "passthrough",
		runtime: { mode: "local", type: "pages" },
	}),
});
