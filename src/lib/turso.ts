import { createClient } from "@libsql/client/web";

export const client = createClient({
	url: import.meta.env.TURSO_DB_URL,
	authToken: import.meta.env.TURSO_DB_AUTH_TOKEN,
});

export interface Article {
	id: number;
	title: string;
	description: string;
	slug: string;
	content?: string;
	hero: string;
	author?: string;
	created_at: number;
	publish_date?: number;
	published?: boolean;
}
