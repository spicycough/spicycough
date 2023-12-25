import type { APIRoute } from "astro";

import { useDatabase } from "@/db/useDatabase";

export const POST: APIRoute = async ({ request }) => {
	console.info("HEADERS", request.headers);
	const { db, schema } = useDatabase();

	try {
		const data = await request.formData();
		const { urls } = await handleFormData(data);

		const toValue = (url: string) => ({ sourceUrl: url });
		const records = await db
			.insert(schema.contentItemQueue)
			.values(urls.map(toValue))
			.returning()
			.execute();

		return new Response(JSON.stringify(records), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify(error), { status: 400 });
	}
};

const handleFormData = async (data: FormData) => {
	const urls = data.get("urls")?.toString().split("\n") ?? [];

	const hasInvalidUrl = urls.some((url) => !isValidUrl(url));
	if (hasInvalidUrl) throw new Error("Invalid URL provided");

	return { urls };
};

const isValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};
