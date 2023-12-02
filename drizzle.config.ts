import type { Config } from "drizzle-kit";

import { loadEnv } from "vite";

const { PUBLIC_TURSO_DB_URL, PUBLIC_TURSO_DB_AUTH_TOKEN } = loadEnv(
	process.env.MODE as string,
	process.cwd(),
	"PUBLIC",
);

const devConfig: Config = {
	schema: "./src/db/schema.ts",
	out: "./database/migrations",
	driver: "turso",
	dbCredentials: {
		url: "http://localhost:8080",
	},
} satisfies Config;

const config: Config = {
	schema: "./src/db/schema.ts",
	out: "./database/migrations",
	driver: "turso",
	dbCredentials: {
		url: PUBLIC_TURSO_DB_URL as string,
		authToken: PUBLIC_TURSO_DB_AUTH_TOKEN as string,
	},
} satisfies Config;

export default process.env.PROD ? config : devConfig;
