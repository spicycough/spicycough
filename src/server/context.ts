import { useDatabase } from "@/db/useDatabase";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
	const { db, schema } = useDatabase();

	return { req, resHeaders, db, schema };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
