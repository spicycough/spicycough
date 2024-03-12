/// <reference types="astro/client" />

import { z } from 'astro:content';
import type { env } from './variables';

type Runtime = import('@astrojs/cloudflare').DirectoryRuntime<ENV>;

interface ImportMeta {
  readonly env: z.infer<typeof env>;
}
