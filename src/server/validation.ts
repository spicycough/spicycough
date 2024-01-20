import { Type } from "@sinclair/typebox";
import { insertContentItemSchema, selectContentItemSchema } from "@/db/schema";

export const useValidationSchema = () => {
	return {
		insert: insertContentItemSchema,
		update: insertContentItemSchema,
		select: selectContentItemSchema,
		clear: Type.Void(),
		byId: Type.Object({ id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]) }),
		delete: Type.Object({ id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]) }),
		refresh: Type.Object({ id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]) }),
		patch: Type.Object({ id: Type.Index(Type.Pick(selectContentItemSchema, ["id"]), ["id"]) }),
		create: Type.Object({
			url: Type.Index(Type.Pick(insertContentItemSchema, ["permalink"]), ["permalink"]),
		}),
		bulkCreate: Type.Object({
			urls: Type.Array(
				Type.Index(Type.Pick(insertContentItemSchema, ["permalink"]), ["permalink"]),
			),
		}),
	};
};
