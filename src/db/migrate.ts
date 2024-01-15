import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate as drizzleMigrate } from "drizzle-orm/libsql/migrator";
import { useDatabase } from "./useDatabase";

type Database = LibSQLDatabase<Record<string, never>>;

export const migrate = (db: Database) => {
	drizzleMigrate(db, { migrationsFolder: "./database/migrations" })
		.then(() => console.log("Migrations complete"))
		.catch((err) => console.log("Migrations failed", err));
};

const url = import.meta.env.PUBLIC_TURSO_DB_URL ?? process.env.PUBLIC_TURSO_DB_URL;
const authToken =
	import.meta.env.PUBLIC_TURSO_DB_AUTH_TOKEN ?? process.env.PUBLIC_TURSO_DB_AUTH_TOKEN;
const { db } = useDatabase({ url, authToken });

await drizzleMigrate(db, { migrationsFolder: "./database/migrations" });
