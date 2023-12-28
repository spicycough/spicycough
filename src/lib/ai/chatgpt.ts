import OpenAI, { type ClientOptions } from "openai";
import type {
	ChatCompletion,
	ChatCompletionMessageParam,
	ChatCompletionCreateParamsBase,
} from "openai/resources/chat/completions";
import { useCallback, useState } from "react";

export const createClient = (opts: ClientOptions) => {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("Missing OpenAI API key");
	}

	console.info("Creating OpenAI client");
	return new OpenAI({ apiKey, ...opts });
};

export type UseGpt = {
	request: (messages: ChatCompletionMessageParam[]) => void;
	isLoading: boolean;
	format: () => string;
} & (
	| {
			data: OpenAI.Chat.Completions.ChatCompletion;
	  }
	| { error: Error | null }
);

export const useGpt = (
	model: ChatCompletionCreateParamsBase["model"] = "gpt-3.5-turbo",
	opts: ClientOptions = {},
): UseGpt => {
	const [data, setData] = useState<ChatCompletion | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const client = createClient(opts);

	const request = useCallback(
		async (messages: ChatCompletionMessageParam[]) => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await client.chat.completions.create({ model, messages }, opts);

				setData(response);
			} catch (err) {
				setError(err instanceof Error ? err : new Error("An error occurred"));
				console.error("Error from OpenAI API", err);
			} finally {
				setIsLoading(false);
			}
		},
		[model, client, opts],
	);

	if (data) {
		console.debug("[ID]", data.id);
		console.debug("[Model]", data.model);
		console.debug("[Timestamp (s)]", data.created);
		console.debug("[Fingerprint]", data.system_fingerprint);
	}

	const format = useCallback(() => data && toString(data.choices), [data.choices]);

	return { request, data, isLoading, error, format };
};

const toString = (choices: OpenAI.Chat.Completions.ChatCompletion.Choice[], sep = "\n") =>
	choices.map((c) => c.message.content).join(sep);
