import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "../server/router";

const trpcReact = createTRPCReact<AppRouter>();

const trpcAstro = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${new URL(import.meta.url).host}/api`,
		}),
	],
});

export { trpcAstro, trpcReact };
