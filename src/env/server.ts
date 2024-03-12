import { createEnv } from '@t3-oss/env-core';
import { z } from 'astro:content';

export const env = createEnv({
  isServer: import.meta.env.SSR,
  server: {
    TURSO_DB_URL: z.string().url(),
    TURSO_DB_AUTH_TOKEN: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
});
