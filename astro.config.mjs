import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://spicycough.com',
  output: 'server',
  integrations: [tailwind({ applyBaseStyles: false })],
  adapter: cloudflare({
    mode: 'directory',
    imageService: 'passthrough',
    runtime: { mode: 'local', type: 'pages' },
  }),
  compressHTML: true,
  prefetch: true,
});
