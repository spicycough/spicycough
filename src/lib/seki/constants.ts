const Document = {
	base: "base",
	head: "head",
	link: "link",
	meta: "meta",
	style: "style",
	title: "title",
} as const;

const Sectioning = {
	address: "address",
	article: "article",
	aside: "aside",
	footer: "footer",
	header: "header",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
	hgroup: "hgroup",
	main: "main",
	nav: "nav",
	section: "section",
	search: "search",
} as const;

const Text = {
	blockquote: "blockquote",
	dd: "dd",
	div: "div",
	dl: "dl",
	dt: "dt",
	figcaption: "figcaption",
	figure: "figure",
	hr: "hr",
	li: "li",
	menu: "menu",
	ol: "ol",
	p: "p",
	pre: "pre",
	ul: "ul",
} as const;

const InlineText = {
	a: "a",
	abbr: "abbr",
	b: "b",
	bdi: "bdi",
	bdo: "bdo",
	br: "br",
	cite: "cite",
	code: "code",
	data: "data",
	dfn: "dfn",
	em: "em",
	i: "i",
	kbd: "kbd",
	mark: "mark",
	q: "q",
	rp: "rp",
	rt: "rt",
	ruby: "ruby",
	s: "s",
	samp: "samp",
	small: "small",
	span: "span",
	strong: "strong",
	sub: "sub",
	sup: "sup",
	time: "time",
	u: "u",
	var: "var",
	wbr: "wbr",
} as const;

const ImageAndMultimedia = {
	area: "area",
	audio: "audio",
	img: "img",
	map: "map",
	track: "track",
	video: "video",
} as const;

const Embed = {
	embed: "embed",
	iframe: "iframe",
	object: "object",
	picture: "picture",
	portal: "portal",
	source: "source",
} as const;

const Form = {
	button: "button",
	datalist: "datalist",
	fieldset: "fieldset",
	form: "form",
	input: "input",
	label: "label",
	legend: "legend",
	meter: "meter",
	optgroup: "optgroup",
	option: "option",
	output: "output",
	progress: "progress",
	select: "select",
	textarea: "textarea",
} as const;

const Script = {
	canvas: "canvas",
	noscript: "noscript",
	script: "script",
} as const;

const Table = {
	caption: "caption",
	col: "col",
	colgroup: "colgroup",
	table: "table",
	tbody: "tbody",
	td: "td",
	tfoot: "tfoot",
	th: "th",
	thead: "thead",
	tr: "tr",
} as const;

const Demarcate = {
	del: "del",
	ins: "ins",
} as const;

const Interactive = {
	details: "details",
	dialog: "dialog",
	summary: "summary",
} as const;

const Tags = {
	document: Document,
	sectioning: Sectioning,
	text: Text,
	inlineText: InlineText,
	imageAndMultimedia: ImageAndMultimedia,
	embed: Embed,
	form: Form,
	script: Script,
	table: Table,
	demarcate: Demarcate,
	interactive: Interactive,
} as const;

export {
	Demarcate,
	Document,
	Embed,
	Form,
	ImageAndMultimedia,
	InlineText,
	Interactive,
	Script,
	Sectioning,
	Table,
	Tags,
	Text,
};
