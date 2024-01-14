import type { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { TRPCError } from "@trpc/server";

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

// import Ajv from "ajv";
// import addFormats from "ajv-formats";
//
// /**
//  * Create a type-safe RPC type from a schema
//  *
//  * Taken from:
//  * https://github.com/sinclairzx81/typebox/blob/6cfcdc02cc813af2f1be57407c771fc4fadfc34a/example/trpc/readme.md#with-ajv
//  * */
// export function AjvRpcType<T extends TSchema>(schema: T, references: TSchema[] = []) {
// 	const ajv = addFormats(new Ajv({ coerceTypes: true }), [
// 		"date-time",
// 		"time",
// 		"date",
// 		"email",
// 		"hostname",
// 		"ipv4",
// 		"ipv6",
// 		"uri",
// 		"uri-reference",
// 		"uuid",
// 		"uri-template",
// 		"json-pointer",
// 		"relative-json-pointer",
// 		"regex",
// 	]);

// 	references.forEach((reference) => ajv.addSchema(reference));
// 	const validate = ajv.compile(schema);

// 	return (value: unknown): Static<T> => {
// 		const isValid = validate(value);
// 		if (isValid) return value;

// 		const { message, instancePath } = validate.errors![0];
// 		throw new TRPCError({ message: `${message} for ${instancePath}`, code: "BAD_REQUEST" });
// 	};
// }
