import * as cheerio from "cheerio";
import { P, match } from "ts-pattern";
import { ElementType } from "domelementtype";

export const parse = (element: cheerio.AnyNode): string => {
	if (!element) {
		console.error("Invalid input: element is null or undefined.");
		return "";
	}

	const $ = cheerio.load(element);

	const parseChildren = (el: cheerio.AnyNode): string =>
		$(el)
			.contents()
			.map((_, child) => parse(child))
			.get()
			.join("");

	try {
		return match<cheerio.AnyNode>(element)
			.returnType<string>()
			.with({ type: ElementType.Tag }, (selections) => {
				const el = selections as cheerio.Element;
				const tagName = el.tagName.toLowerCase();

				return match(tagName)
					.with(P.union("sub", "sup"), () => "")
					.with(P.union("figure"), () => "")
					.with("br", () => `\n`)
					.with(P.union("i", "em"), () => `*${parseChildren(el)}*`)
					.with(P.union("b", "strong"), () => `**${parseChildren(el)}**`)
					.with(P.union("p", "section"), () => `${parseChildren(el)}\n\n`)
					.with("h1", () => `# ${parseChildren(el)}\n\n`)
					.with("h2", () => `## ${parseChildren(el)}\n\n`)
					.with("h3", () => `### ${parseChildren(el)}\n\n`)
					.with("h4", () => `#### ${parseChildren(el)}\n\n`)
					.with("h5", () => `##### ${parseChildren(el)}\n\n`)
					.with("h6", () => `###### ${parseChildren(el)}\n\n`)
					.with("blockquote", () => `> ${parseChildren(el)}\n`)
					.with("code", () => `\`${parseChildren(el)}\``)
					.with("pre", () => `\`\`\`${parseChildren(el)}\`\`\``)
					.with("a", () => `[${parseChildren(el)}](${el.attribs.href})`)
					.with("img", () => `![${el.attribs.alt}](${el.attribs.src})`)
					.with(P.union("ol", "ul"), (tag) =>
						$(el)
							.find("li")
							.map((_, li) => {
								return `${tag === "ol" ? "1." : "-"} ${parseChildren(li)}`;
							})
							.get()
							.join("\n"),
					)
					.otherwise(() => parseChildren(el));
			})
			.with({ type: ElementType.Text }, (el) => $(el).text())
			.otherwise(() => "")
			.replace(/\n\s*\n/g, "\n\n");
	} catch (e) {
		console.error(`Error while parsing: ${e}`);
		return "";
	}
};
