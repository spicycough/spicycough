import * as cheerio from "cheerio";
import { P, match } from "ts-pattern";
import { ElementType } from "domelementtype";

export const parse = (element: cheerio.AnyNode): string => {
	const $ = cheerio.load(element);

	const asText = (el: cheerio.Element) => $(el).text();

	const { Comment, Script, Style, Root } = ElementType;

	let r;
	try {
		r = match<cheerio.AnyNode>(element)
			.returnType<string>()
			.with({ type: P.union(Comment, Script, Style, Root) }, () => {
				console.log(`Skipping ${element.type} element`);
				return "";
			})
			.with({ type: ElementType.Text }, (el) => {
				const t = $(el).text();
				console.log(`Parsing ${el.type} element with text ${t}`);
				return t;
			})
			.with({ type: ElementType.Tag }, (el) =>
				match(el)
					.with({ children: P.not(P.nullish) }, (el) => {
						return $(el as cheerio.Element)
							.contents()
							.map((_, child) => parse(child))
							.get()
							.join("\n");
					})
					.otherwise(() =>
						match(el)
							.with({ tagName: "p" }, (e) => `${asText(e as cheerio.Element)}`)
							.with({ tagName: "br" }, () => `\n`)
							// Headings
							.with({ tagName: "h1" }, (e) => `# ${asText(e as cheerio.Element)}`)
							.with({ tagName: "h2" }, (e) => `## ${asText(e as cheerio.Element)}`)
							.with({ tagName: "h3" }, (e) => `### ${asText(e as cheerio.Element)}`)
							.with({ tagName: "h4" }, (e) => `#### ${asText(e as cheerio.Element)}`)
							.with({ tagName: "h5" }, (e) => `##### ${asText(e as cheerio.Element)}`)
							.with({ tagName: "h6" }, (e) => `###### ${asText(e as cheerio.Element)}`)
							// Inline
							.with(
								{ tagName: P.union("b", "strong") },
								(e) => `**${asText(e as cheerio.Element)}**`,
							)
							.with({ tagName: P.union("i", "em") }, (e) => `*${asText(e as cheerio.Element)}*`)
							.with({ tagName: P.union("sub", "sup") }, (e) => `*${asText(e as cheerio.Element)}*`)
							// Extra
							.with({ tagName: "span" }, (e) => `*${asText(e as cheerio.Element)}*`)
							.with({ tagName: "div" }, (e) => `*${asText(e as cheerio.Element)}*`)
							.otherwise(() => {
								console.log(`Unhandled ${el.tagName} element`);
								return "";
							}),
					),
			)
			.otherwise(() => {
				console.log(`Unhandled ${element.type} element`);
				return "";
			});
	} catch (e) {
		console.error(e);
	}
	return r;
};

// const pattern = P.union(
// 	...[
// 		"address",
// 		"article",
// 		"aside",
// 		"footer",
// 		"header",
// 		"h1",
// 		"h2",
// 		"h3",
// 		"h4",
// 		"h5",
// 		"h6",
// 		"hgroup",
// 		"main",
// 		"nav",
// 		"section",
// 		"search",
// 	],
// );

const oldParse = (element: cheerio.AnyNode) => {
	const $ = cheerio.load(element);

	const parseElement = (el: cheerio.Element) => {
		const text = $(el).text().trim();

		const parsed: string = match(el)
			.returnType<string>()
			.with({ tagName: P.union("script", "style") }, () => "")
			.with({ tagName: "sub" }, () => `<sub>${text}</sub>`)
			.with({ tagName: "sup" }, () => `<sup>${text}</sup>`)
			.with({ tagName: "del" }, () => `~~${text}~~`)
			.with({ tagName: "u" }, () => `<u>${text}</u>`)
			.with({ tagName: P.union("i", "em") }, () => `*${text}*`)
			.with({ tagName: P.union("b", "strong") }, () => `**${text}**`)
			.with({ tagName: "h1" }, () => `# ${text}`)
			.with({ tagName: "h2" }, () => `## ${text}`)
			.with({ tagName: "h3" }, () => `### ${text}`)
			.with({ tagName: "h4" }, () => `#### ${text}`)
			.with({ tagName: "h5" }, () => `##### ${text}`)
			.with({ tagName: "h6" }, () => `###### ${text}`)
			.with({ tagName: "a" }, () => `[${text}](${el.attribs.href})`)
			.with({ tagName: "blockquote" }, () => `> ${text}`)
			.with({ tagName: "br" }, () => "\n\n")
			.with({ tagName: "img" }, () => `![${el.attribs.alt}](${el.attribs.src})`)
			.with({ tagName: "code" }, () => `\`${text}\``)
			.with({ tagName: "pre" }, () => `\`\`\`${text}\`\`\``)
			.with({ tagName: "ol" }, () =>
				$(el)
					.find("li")
					.map((_, li) => `1. ${$(li).text().trim()}`)
					.get()
					.join("\n"),
			)
			.with({ tagName: "ul" }, () =>
				$(el)
					.find("li")
					.map((_, li) => `- ${$(li).text().trim()}`)
					.get()
					.join("\n"),
			)
			.with({ tagName: P.union("div", "span") }, () =>
				$(el)
					.children()
					.map((_, c) => parseElement(c))
					.get()
					.join("\n"),
			)
			.with({ tagName: "p" }, () => text) // Handle bold, italic, etc
			.otherwise(() => {
				console.log({ tag: el.tagName, text }, "Unhandled element");
				return "";
			});
		return parsed;
	};

	// $(".c-article-body > .main-content section").each((_, section) => {
	// 	const title = ($(section).data("title") as string).trim();
	// 	const markup = $(section)
	// 		.find(":is(p, ul, ol, h1, h2, h3, h4, h5, h6, blockquote)")
	// 		.map((i, child) => parseElement(child).trim() ?? undefined)
	// 		.get();

	// 	sections.push({ title, markup: markup.filter((m) => !!m) });
	// });

	// const fullText = sections.map((section) => section.markup.join("\n")).join("\n\n");
};
