import OpenAI, { type ClientOptions } from "openai";
import type {
	ChatCompletionMessageParam,
	ChatCompletionCreateParamsBase,
} from "openai/resources/chat/completions";

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
	model: ChatCompletionCreateParamsBase["model"] = "gpt-3.5-turbo",
	opts?: ClientOptions,
) => {
	console.info("Making request to OpenAI API");

	let resp;
	let isLoading = true;

	client.chat.completions
		.create(
			{
				model,
				messages,
			},
			opts,
		)
		.then((r) => {
			console.info("Received response from OpenAI API");
			resp = r;
			return resp;
		})
		.catch((err) => {
			console.error("Error from OpenAI API", err);
			return err;
		})
		.finally(() => {
			isLoading = false;
		});

	resp = resp!;

	const text = toString(resp.choices);

	console.debug("[ID]", resp.id);
	console.debug("[Model]", resp.model);
	console.debug("[Timestamp (s)]", resp.created);
	console.debug("[Fingerprint]", resp.system_fingerprint);
	return { resp, text, isLoading };
};

/* Utilities */

const toString = (choices: OpenAI.Chat.Completions.ChatCompletion.Choice[], sep = "\n") =>
	choices.map((c) => c.message.content).join(sep);
