import { createClient as createLocalClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import { match } from "ts-pattern";
import * as schema from "./schema";

type DatabaseParams = {
	url: string;
	authToken: string;
};

export const useDatabase = (params?: DatabaseParams) => {
	const createClientFn = match(import.meta.env.PROD)
		.with(true, () => createClient)
		.otherwise(() => createLocalClient);

	const client = createClientFn({
		url: params?.url ?? (import.meta.env.PUBLIC_TURSO_DB_URL as string),
		authToken: params?.authToken ?? (import.meta.env.PUBLIC_TURSO_DB_AUTH_TOKEN as string),
	});

	const db = drizzle(client, { schema });

	return { db, schema };
};

export type UseDatabase = ReturnType<typeof useDatabase>;
