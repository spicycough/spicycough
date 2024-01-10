import { initTRPC, type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import type { Context } from "./context";
import { buildRouter as buildContentItemRouter } from "./routes/contentItems";
import type { inferReactQueryProcedureOptions } from "@trpc/react-query";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
	contentItem: buildContentItemRouter(),
});

export type AppRouter = typeof appRouter;

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
