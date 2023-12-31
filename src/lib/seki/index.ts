import { gotScraping, type Response } from "got-scraping";
import { P, match } from "ts-pattern";
import { router } from "./router";

import { type ScrapeOptions, type ParsedData } from "./types";
import { Hostnames } from "./constants";

const includes = P.string.includes;

const parse = (url: URL, response: Response<string>): ParsedData => {
	const parsingFunc = match(url.hostname)
		.with(includes(Hostnames.NATURE), () => router.nature)
		.otherwise(() => () => ({}) as ParsedData);

	return parsingFunc({ response });
};

type UseScrape = {
	url: URL;
	options?: ScrapeOptions;
	onSuccess?: () => void;
};

export const useScrape = async ({
	url,
	options,
}: UseScrape): Promise<{ data: ParsedData; response: Response<string> }> => {
	const debugLocal = true;
	url = debugLocal
		? new URL("file:///Users/tim/Dropbox/projects/astro/spicycough-react/src/lib/seki/test.html")
		: url;

	console.info(`Processing ${url}`);

	const response = await gotScraping(url.href, options);

	const parsedData = parse(url, response);

	return { data: parsedData, response };
};
