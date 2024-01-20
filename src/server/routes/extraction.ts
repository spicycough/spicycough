import { Type } from "@sinclair/typebox";
import { publicProcedure, router } from "../router";
import { RpcType } from "../utils";
import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import type { NewExtractedField } from "@/db/schema";
import { match } from "ts-pattern";

export const buildRouter = () => {
	return router({
		new: publicProcedure
			.input(RpcType(Type.Object({ url: Type.String() })))
			.mutation(async ({ ctx: { db, schema }, input: { url } }) => {
				const _url = new URL(url);

				// Assume doesn't exist
				await db.insert(schema.extractedUrls).values({ url: _url.href }).execute();

				const response = await gotScraping(_url.href);
				const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

				const field: NewExtractedField = {
					name: "title",
					cssSelector: "title",
					selectionMethod: "text",
				};
				field.value = getField($, field);

				await db.insert(schema.extractedFields).values(field).execute();

				return (
					$("title").text() ||
					$("meta[name='title']").attr("content") ||
					document.title ||
					($("h1").length > 0 ? $("h1").text() : "") ||
					""
				);
			}),
	});
};

const getField = (_$: cheerio.CheerioAPI, { cssSelector, selectionMethod }: NewExtractedField) => {
	return match(selectionMethod)
		.with("text", () => _$(cssSelector).text())
		.with("attr", () => _$(cssSelector).attr("content"))
		.with("prop", () => _$(cssSelector).prop("content"))
		.otherwise(() => "")!;
};
