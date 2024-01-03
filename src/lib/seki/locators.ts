import * as cheerio from "cheerio";

export const findSections = (html: string) => {
	const $ = cheerio.load(html, { recognizeSelfClosing: true });

	const mainSelectors = ["main", "article", "div.main", "div.article"];
	const main = mainSelectors.find((selector) => $(selector).length > 0);

	const sectionSelectors = ["section", "div.section", "div.article-section"];
	return sectionSelectors.find((selector) => $(main).find(selector).length > 0);
};
