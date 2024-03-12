import { createClient } from '@libsql/client/web';
import { env } from '@/variables';

export const client = createClient({
  url: env.TURSO_DB_URL,
  authToken: env.TURSO_DB_AUTH_TOKEN,
});
