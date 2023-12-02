import * as cheerio from "cheerio";
import wretch from "wretch";

import { match } from "ts-pattern";
import { getDomainFromUrl } from "@/lib/utils";

const ContentSources = {
	NATURE: "nature",
};

type ScrapeFn = (body: string) => string;

const nature = (body: string) => {
	console.log("body", body);
	const $ = cheerio.load(body);
	const text = $("article").text();
	console.log("TEXT", text);
	return text;
};

const scrapeNature = async (url: string) => {
	return new CheerioCrawler({
		requestHandler: async ({ request, $ }) => {
			const title = $('meta[name="dc.Title"]').attr("content");
			const authors = $('meta[name="dc.Creator"]')
				.map((i, el) => $(el).attr("content"))
				.get();
			const publicationDate = $('meta[name="dc.Date"]').attr("content");
			const abstract = $('meta[name="dc.Description"]').attr("content");
			const summary = $("div.article__body").text().trim(); // Adjust selector based on actual page structure
			const permalink = url;

			return {
				title,
				authors,
				publicationDate,
				abstract,
				summary,
				permalink,
			};
		},
	});
};

export const scrape = async (url: string): Promise<string | undefined> => {
	const domain = getDomainFromUrl(url);
	const body = await wretch(url).get().text();

	const scrapeFn = match(domain)
		.returnType<ScrapeFn | undefined>()
		.with(ContentSources.NATURE, () => nature)
		.otherwise((_: string) => {
			console.error("No scraper found for domain", domain);
			return undefined;
		});
	return scrapeFn && scrapeFn(body);
};

const url = "https://www.nature.com/articles/s41584-023-00964-y";
scrape(url);
