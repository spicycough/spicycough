import type { FetchLike, WretchOptions } from "wretch/types";

const cloudflare =
	(next: FetchLike): FetchLike =>
	async (url: string, opts: WretchOptions) => {
		const response = await next(url, opts);
		try {
			Reflect.get(response, "type", response);
		} catch (error) {
			Object.defineProperty(response, "type", {
				get: () => "default",
			});
		}
		return response;
	};

export const useMiddleware = () => {
	return {
		cloudflare,
	};
};
