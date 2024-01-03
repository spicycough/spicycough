import * as cheerio from "cheerio";
import { gotScraping, type Response } from "got-scraping";
import { getSelectors } from "./router";
import { parse } from "./parsing";

import { type ScrapeOptions, type ParsedData, type ContentSelectors } from "./types";

type UseScrape = {
	url: URL;
	options?: ScrapeOptions;
	onSuccess?: () => void;
};

export const useScrape = async ({
	url,
	options,
}: UseScrape): Promise<{ data: ParsedData; response: Response<string> }> => {
	console.debug(`Processing ${url}`);

	const response = await gotScraping(url.href, options);

	const $ = cheerio.load(response.body, { recognizeSelfClosing: true });

	const cssSelectors = getSelectors(url.hostname);
	const results: ParsedData = {
		title: "",
		authors: "",
		publicationDate: "",
		abstract: "",
		fullText: "",
	};

	Object.keys(cssSelectors).forEach((key) => {
		const selectors: string[] = cssSelectors[key as keyof ContentSelectors];

		selectors.forEach((selector) => {
			console.debug(`Processing ${key} with selector: ${selector}`);

			const elements = $(selector);
			if (elements.length > 0) {
				elements.each((_, element) => {
					const parsedOutput = parse(element);
					results[key as keyof ParsedData] += parsedOutput;
				});
			}
		});
	});
	return { data: results, response };
};
