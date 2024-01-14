import { ContentItemKind, insertContentItemSchema, selectContentItemSchema } from "@/db/schema";
import { useDatabase, type UseDatabase } from "@/db/useDatabase";
import { Type, type TObject } from "@sinclair/typebox";
import { RpcType, head } from "../utils";
import { useScrape } from "@/lib/seki";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../router";
import { match } from "ts-pattern";

type ValidationSchema = TObject;

const EndpointType = {
	QUERY: "query",
	MUTATION: "mutation",
} as const;

type EndpointType = (typeof EndpointType)[keyof typeof EndpointType];

type Endpoint = {
	name: string;
	type: EndpointType;
	validationSchema: ValidationSchema;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	func: (db: UseDatabase) => any;
};

const list: Endpoint = {
	name: "list",
	type: EndpointType.QUERY,
	validationSchema: selectContentItemSchema,
	func:
		({ db, schema }: UseDatabase) =>
		async () =>
			await db.select().from(schema.contentItems).execute(),
};

const getById: Endpoint = {
	name: "byId",
	type: EndpointType.QUERY,
	validationSchema: Type.Object({
		id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]),
	}),
	func:
		({ db, schema }: UseDatabase) =>
		async ({ input: id }: { input: number }) =>
			head(
				await db.select().from(schema.contentItems).where(eq(schema.contentItems.id, id)).execute(),
			),
};

const bulkCreate: Endpoint = {
	name: "bulkCreate",
	type: EndpointType.MUTATION,
	validationSchema: Type.Object({
		urls: Type.Array(Type.Index(Type.Pick(insertContentItemSchema, ["permalink"]), ["permalink"])),
	}),
	func:
		({ db, schema }: UseDatabase) =>
		async ({ input: urls }: { input: string[] }) => {
			const scrapedContentItems = await Promise.all(
				urls.map(async (u) => {
					const url = new URL(u);
					const { data } = await useScrape({ url });
					return {
						permalink: url.href,
						kind: ContentItemKind.ARTICLE,
						title: data.title,
						publishedAt: data.publicationDate,
						abstract: data.abstract,
						slug: slugify(data.title),
						authors: data.authors,
						fullText: data.fullText,
					};
				}),
			);
			return await db.insert(schema.contentItems).values(scrapedContentItems).returning().execute();
		},
};

const create: Endpoint = {
	name: "create",
	type: EndpointType.MUTATION,
	validationSchema: Type.Object({
		url: Type.Index(Type.Pick(insertContentItemSchema, ["permalink"]), ["permalink"]),
	}),
	func:
		({ db, schema }: UseDatabase) =>
		async ({ input }: { input: string }) => {
			const url = new URL(input);
			const { data } = await useScrape({ url });
			const scrapedContentItems = {
				permalink: url.href,
				kind: ContentItemKind.ARTICLE,
				title: data.title,
				publishedAt: data.publicationDate,
				abstract: data.abstract,
				slug: slugify(data.title),
				authors: data.authors,
				fullText: data.fullText,
			};
			return await db.insert(schema.contentItems).values(scrapedContentItems).returning().execute();
		},
};

const update: Endpoint = {
	name: "update",
	type: EndpointType.MUTATION,
	validationSchema: insertContentItemSchema,
	func:
		({ db, schema }: UseDatabase) =>
		async ({ input: { id, ...rest } }: { input: typeof insertContentItemSchema }) =>
			head(
				await db
					.update(schema.contentItems)
					.set(rest)
					.where(eq(schema.contentItems.id, id))
					.returning()
					.execute(),
			),
};

const refresh: Endpoint = {
	name: "refresh",
	type: EndpointType.MUTATION,
	validationSchema: Type.Object({
		id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]),
	}),
	func:
		({ db, schema }: UseDatabase) =>
		async ({ input: id }: { input: number }) => {
			const existing = head(
				await db.select().from(schema.contentItems).where(eq(schema.contentItems.id, id)).execute(),
			);
			if (!existing) throw new Error(`Content item with ID ${id} does not exist.`);
			const url = new URL(existing.permalink);
			const { data } = await useScrape({ url });
			return await db
				.update(schema.contentItems)
				.set({
					permalink: url.href,
					kind: ContentItemKind.ARTICLE,
					title: data.title,
					publishedAt: data.publicationDate,
					abstract: data.abstract,
					slug: slugify(data.title),
					authors: data.authors,
					fullText: data.fullText,
				})
				.where(eq(schema.contentItems.permalink, url.href))
				.returning()
				.execute();
		},
};

const deleteById: Endpoint = {
	name: "delete",
	type: EndpointType.MUTATION,
	validationSchema: Type.Object({
		id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]),
	}),
	func:
		({ db, schema }: UseDatabase) =>
		async ({ input: id }: { input: number }) =>
			await db.delete(schema.contentItems).where(eq(schema.contentItems.id, id)).execute(),
};

export const buildRouter = () => {
	const { db, schema } = useDatabase();

	const queries: Endpoint[] = [list, getById];
	const mutations: Endpoint[] = [bulkCreate, create, update, refresh, deleteById];

	const endpoints: Endpoint[] = [...queries, ...mutations];
	return router(
		endpoints.reduce((router, endpoint) => {
			const { name, type, validationSchema, func } = endpoint;

			const route = match(type)
				.with("query", () => {
					return {
						[name]: publicProcedure
							.input(RpcType(validationSchema))
							.query(() => func({ db, schema })),
					};
				})
				.with("mutation", () => {
					return {
						[name]: publicProcedure
							.input(RpcType(validationSchema))
							.mutation(() => func({ db, schema })),
					};
				}).exhaustive;

			return { ...router, route };
		}, {}),
	);
};
