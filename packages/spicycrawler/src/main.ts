import * as cheerio from "cheerio";
import { gotScraping } from "got-scraping";
import { P, match } from "ts-pattern";

const hostnames = {
	NATURE: "nature.com",
} as const;

type RouteContext = {
	url: URL;
	response: Response;
};

type ParsingFunction = (context: RouteContext) => Promise<unknown>;

const nature = async ({ response }: RouteContext) => {
	const body = await response.text();
	const $ = cheerio.load(body);

	const title = $("h1.c-article-title").text().trim();
	const author = $("li.c-article-author-list__item")
		.map((_, el) => $(el).text().trim())
		.get(0);

	const articleData = {
		url: response.url,
		title,
		author,
		// publicationDate,
		// sourceUrl,
		// abstract,
		// fullText,
	};

	return articleData;
};

const route = async (url: string) => {
	console.log(`Processing ${url}`);
	const parsedUrl = new URL(url);

	const response = await gotScraping(parsedUrl.href);

	const includes = P.string.includes;
	const parsingFn: ParsingFunction = match(parsedUrl.hostname)
		.with(includes(hostnames.NATURE), () => nature)
		.otherwise(() => async () => {
			console.error(`No parsing function for ${parsedUrl.hostname}`);
		});

	return parsingFn({ url: parsedUrl, response });
};

const r = await route("https://www.nature.com/articles/d41586-021-01513-4");
console.log(r);
