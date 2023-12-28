import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import cloudflare from "@astrojs/cloudflare";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://spicycough.com",
	integrations: [
		alpinejs(),
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
	],
	image: {
		service: {
			entrypoint: "astro/assets/services/noop",
		},
	},
	output: "server",
	adapter: cloudflare({ mode: "directory" }),
});
