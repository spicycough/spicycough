import OpenAI, { type ClientOptions } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const createClient = (opts: ClientOptions) => {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("Missing OpenAI API key");
	}

	console.info("Creating OpenAI client");
	return new OpenAI({ apiKey, ...opts });
};

export const makeRequest = async (
	client: OpenAI,
	messages: ChatCompletionMessageParam[],
	opts?: ClientOptions,
) => {
	console.info("Making request to OpenAI API");
	const resp = await client.chat.completions.create(
		{
			model: "gpt-4",
			messages,
		},
		opts,
	);
	const { choices } = resp;

	return resp.choices.map((c) => c.message.content).join("\n");
};
