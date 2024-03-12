import { createEnv } from '@t3-oss/env-core';
import { z } from 'astro:content';

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  client: {
    PUBLIC_SITE_URL: z.string().url().min(1),
  },
  runtimeEnv: import.meta.env,
});
