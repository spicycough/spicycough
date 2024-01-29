import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";

const ignoreTags = [
	"area",
	"aside",
	"audio",
	"base",
	"bb",
	"bdi",
	"bdo",
	"button",
	"canvas",
	"caption",
	"col",
	"colgroup",
	"command",
	"datalist",
	"dfn",
	"embed",
	"form",
	"iframe",
	"input",
	"kbd",
	"keygen",
	"map",
	"math",
	"meter",
	"nav",
	"noscript",
	"object",
	"optgroup",
	"option",
	"output",
	"param",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"samp",
	"script",
	"select",
	"source",
	"style",
	"svg",
	"table",
	"textarea",
	"time",
	"track",
	"tt",
	"var",
	"video",
	"wbr",
];

export const extractByParagraph = async (html: string) => {
	const nhm = new NodeHtmlMarkdown({
		ignore: ignoreTags,
		keepDataImages: false,
		useLinkReferenceDefinitions: true,
	});

	const $ = cheerio.load(html, { recognizeSelfClosing: true }, false);

	return $("article section")
		.map((_, section) => {
			const block = $(section).html();
			return block && nhm.translate(block);
		})
		.get()
		.join("\n");
};

export const extractAll = async (html: string) => {
	const nhm = new NodeHtmlMarkdown({
		ignore: ignoreTags,
		keepDataImages: false,
		useLinkReferenceDefinitions: true,
	});

	const $ = cheerio.load(html, { recognizeSelfClosing: true }, false);

	const sections = $("article section")
		.map((_, section) => $(section).html())
		.get()
		.join("\n");

	return nhm.translate(sections);
};
