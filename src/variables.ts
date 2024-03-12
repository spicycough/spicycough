import { createEnv } from '@t3-oss/env-core';
import { z } from 'astro/zod';

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  client: {},
  shared: {
    ENV: z.enum(['development', 'production']).nullish(),
    DEV: z.boolean().nullish(),
    PROD: z.boolean().nullish(),
    BASE_URL: z.string().nullish(),
    SITE: z.string().url().nullish(),
  },
  server: {
    SITE_URL: z.string().url(),
    TURSO_DATABASE_URL: z.string().url().nullish(),
    TURSO_AUTH_TOKEN: z.string().url().nullish(),
  },
  runtimeEnv: import.meta.env,
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
