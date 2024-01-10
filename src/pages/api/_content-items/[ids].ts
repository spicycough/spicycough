import { useDatabase } from "@/db/useDatabase";
import type { APIRoute } from "astro";
import { inArray } from "drizzle-orm";

// get
export const GET: APIRoute = async ({ params }) => {
	const { db, schema } = useDatabase();

	const ids = parseIds(params.ids);

	try {
		const contentItems = await db
			.select()
			.from(schema.contentItems)
			.where(inArray(schema.contentItems.id, ids))
			.execute();

		return new Response(JSON.stringify({ contentItems: contentItems }), { status: 200 });
	} catch (err) {
		return new Response(
			JSON.stringify({ message: err instanceof Error ? err.message : "Unknown error" }),
			{ status: 400 },
		);
	}
};

// refresh
export const POST: APIRoute = async ({ params }) => {
	const { db, schema } = useDatabase();

	const ids = parseIds(params.ids);

	try {
		const resp = await db
			.select()
			.from(schema.contentItems)
			.where(inArray(schema.contentItems.id, ids))
			.execute();

		return new Response(JSON.stringify(resp), { status: 204 });
	} catch (err) {
		return new Response(
			JSON.stringify({ message: err instanceof Error ? err.message : "Unknown error" }),
			{ status: 400 },
		);
	}
};

// delete
export const DELETE: APIRoute = async ({ params }) => {
	const { db, schema } = useDatabase();

	const ids = parseIds(params.ids);
	console.log("DELETING", ids);

	try {
		const resp = await db
			.delete(schema.contentItems)
			.where(inArray(schema.contentItems.id, ids))
			.execute();

		return new Response(JSON.stringify({ rows: resp.rowsAffected }), { status: 200 });
	} catch (err) {
		return new Response(
			JSON.stringify({ message: err instanceof Error ? err.message : "Unknown error" }),
			{ status: 400 },
		);
	}
};

const parseIds = (ids?: string): number[] => {
	return ids?.split(",").map((id) => parseInt(id, 10)) ?? [];
};
