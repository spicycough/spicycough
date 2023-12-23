import wretch from "wretch";
import { API_URL, API_TOKEN } from "./constants";
import { useMiddleware } from "./useMiddleware";

type LoginParams = {
	url: string;
	token: string;
};

/**
 * Initiates a login process with provided URL and token
 *
 * @param url The URL to login to.
 * @param token The token to use for authentication.
 * @returns A promise resolving to the response in JSON format.
 */
const buildClient = ({ url, token }: LoginParams) => {
	const { cloudflare } = useMiddleware();

	return wretch(url, { credentials: "include", mode: "cors" }) // Base url
		.auth(`Bearer ${token}`)
		.middlewares([cloudflare]);
};

type CollectionsParams = {
	id: string;
};

export const useRaindrop = () => {
	const client = buildClient({
		url: API_URL,
		token: API_TOKEN,
	});

	return {
		...{
			client,
			collections: {
				all: async () =>
					await client
						.get("/collections")
						.json()
						.then((json) => json),
				byId: async ({ id }: CollectionsParams) =>
					await client
						.get(`/collections/${id}`)
						.json()
						.then((json) => json),
			},
		},
	};
};
