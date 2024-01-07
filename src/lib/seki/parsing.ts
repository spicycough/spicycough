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
					.with(P.union("sub", "sup", "figure"), () => "")
					.with(P.union("br"), () => `\n`)
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
					.with("a", () => `[${parseChildren(el)}]()`)
					.with("img", () => `![${el.attribs.alt}](${el.attribs.src})`)
					.with(P.union("ol", "ul"), (tag) =>
						$(el)
							.find("li")
							.map((_, li) => `${tag === "ol" ? "1." : "-"} ${parseChildren(li)}`)
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

export const extractTitle = (
	element: cheerio.AnyNode,
	extraSelectors?: string[],
): string | undefined => {
	const fallbackSelectors = [`*[class*="title"]`];

	const $ = cheerio.load(element);

	const selectors = [...(extraSelectors ?? []), ...fallbackSelectors];
	for (const selector of selectors) {
		const text = $(selector).text().trim();
		if (!text) continue;

		return text;
	}

	return;
};

export const extractAuthors = (
	element: cheerio.AnyNode,
	extraSelectors?: string[],
): string | undefined => {
	const fallbackSelectors = [`*[class*="author"]`];

	const $ = cheerio.load(element);

	const selectors = [...(extraSelectors ?? []), ...fallbackSelectors];
	for (const selector of selectors) {
		const text = $(selector).text().trim();
		if (!text) continue;

		return text;
	}

	return;
};

export const extractPublicationDate = (
	element: cheerio.AnyNode,
	extraSelectors?: string[],
): string | undefined => {
	const fallbackSelectors = [`*[class*="publish"]`];

	const $ = cheerio.load(element);

	const selectors = [...(extraSelectors ?? []), ...fallbackSelectors];
	for (const selector of selectors) {
		const text = $(selector).text().trim();
		if (!text) continue;

		try {
			const date = new Date(text);
			return date.toISOString();
		} catch (e) {
			continue;
		}
	}

	return;
};

export const extractAbstract = (
	element: cheerio.AnyNode,
	extraSelectors?: string[],
): string | undefined => {
	const fallbackSelectors = [`main :contains("Abstract")`, `main *[class*="abstract"`];

	const $ = cheerio.load(element);

	const selectors = [...(extraSelectors ?? []), ...fallbackSelectors];
	for (const selector of selectors) {
		const text = $(selector).text().trim();
		if (!text) continue;

		return text;
	}

	return;
};

export const extractFullText = (
	element: cheerio.AnyNode,
	extraSelectors?: string[],
): string | undefined => {
	const fallbackSelectors = [`main section`];

	const $ = cheerio.load(element);

	const selectors = [...(extraSelectors ?? []), ...fallbackSelectors];
	return selectors
		.map((selector) =>
			$(selector)
				.contents()
				.map((_, child) => parse(child)),
		)
		.join("\n");
};
