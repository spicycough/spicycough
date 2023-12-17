import { gotScraping, type ExtendedOptionsOfTextResponseBody } from "got-scraping";
import { P, match } from "ts-pattern";
import { router } from "./router";

const includes = P.string.includes;

const hostnames = {
	NATURE: "nature.com",
} as const;

export type ScrapeOptions = ExtendedOptionsOfTextResponseBody;

export const scrape = async (url: string, options?: ScrapeOptions) => {
	console.info(`Processing ${url}`);
	const parsedUrl = new URL(url);

	const response = await gotScraping(parsedUrl.href, options);

	const parsingFn = match(parsedUrl.hostname)
		.with(includes(hostnames.NATURE), () => router.nature)
		.otherwise(() => async () => {
			console.error(`No parsing function for ${parsedUrl.hostname}`);
		});

	return parsingFn({ response });
};
