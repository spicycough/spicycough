import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { type PropsWithChildren, useState } from "react";

import { trpcReact } from "../client";

export const Server = ({ children }: PropsWithChildren) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpcReact.createClient({
			links: [
				httpBatchLink({
					url: `http://${new URL(import.meta.url).host}/api`,
				}),
			],
		}),
	);

	return (
		<trpcReact.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpcReact.Provider>
	);
};
