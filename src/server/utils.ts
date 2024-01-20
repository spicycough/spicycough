import type { UseDatabase } from "@/db/useDatabase";
import type { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { TRPCError } from "@trpc/server";
import type { TObject } from "@sinclair/typebox";
import type { Context } from "./context";
import { publicProcedure, router } from "./router";
import { match } from "ts-pattern";
import type { inferProcedureParams } from "node_modules/@trpc/server/dist/unstableDoNotImportThis";

/**
 * Create a type-safe RPC type from a schema
 *
 * Taken from:
 * https://github.com/sinclairzx81/typebox/blob/6cfcdc02cc813af2f1be57407c771fc4fadfc34a/example/trpc/readme.md#with-ajv
 * */
export function RpcType<T extends TSchema>(schema: T) {
	const check = TypeCompiler.Compile(schema);
	return (value: unknown) => {
		if (check.Check(value)) return value;

		const { path, message } = check.Errors(value).First()!;
		throw new TRPCError({ message: `${message} for ${path}`, code: "BAD_REQUEST" });
	};
}

type Head = {
	<T extends string>(val: T): T extends `${infer F}${string}` ? F : T extends "" ? "" : string;
	<T extends unknown[]>(
		val: T,
	): T extends readonly never[] | []
		? undefined
		: T extends readonly [infer U, ...infer _]
			? U
			: T[0] | undefined;
};

type T = string | unknown[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const head: Head = (val: T): any => {
	const _head = (val as T)[0];
	return Array.isArray(val) ? _head : _head ?? "";
};

export type ValidationSchema = TObject;

export const EndpointType = {
	QUERY: "query",
	MUTATION: "mutation",
} as const;

export type EndpointType = (typeof EndpointType)[keyof typeof EndpointType];

export type Endpoint = {
	name: string;
	type: EndpointType;
	validationSchema?: ValidationSchema;
	procedure: typeof publicProcedure;
	fn: inferProcedureParams<typeof publicProcedure>;
};

export const buildRouter = () => {
	const [queries, mutations]: [Endpoint[], Endpoint[]] = [[], []];

	const endpoints: Endpoint[] = [...queries, ...mutations];
	return router(
		endpoints.reduce((router, endpoint) => {
			const { name, type, validationSchema, procedure, fn } = endpoint;
			const base = validationSchema ? procedure.input(RpcType(validationSchema)) : procedure;

			const route = match(type)
				.with("query", () => ({
					[name]: base.query(fn),
				}))
				.with("mutation", () => ({
					[name]: base.mutation(fn),
				})).exhaustive;

			return { ...router, route };
		}, {}),
	);
};
