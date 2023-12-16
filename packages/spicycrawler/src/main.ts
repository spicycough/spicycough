import { gotScraping } from "got-scraping";
import { P, match } from "ts-pattern";
import { router } from "./router";

const includes = P.string.includes;

const hostnames = {
	NATURE: "nature.com",
} as const;

export const scrape = async (url: string) => {
	console.info(`Processing ${url}`);
	const parsedUrl = new URL(url);

	const response = await gotScraping(parsedUrl.href);

	const parsingFn = match(parsedUrl.hostname)
		.with(includes(hostnames.NATURE), () => router.nature)
		.otherwise(() => async () => {
			console.error(`No parsing function for ${parsedUrl.hostname}`);
		});

	return parsingFn({ response });
};
