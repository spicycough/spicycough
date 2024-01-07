import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { useDatabase } from "@/db/useDatabase";
import type { PropsWithChildren } from "react";
import { useQueue } from "../_hooks/useQueue";
import { cn } from "@/lib/utils";

export const DeleteAllButton = ({
	className,
	children,
	...props
}: PropsWithChildren<ButtonProps>) => {
	const { db, schema } = useDatabase();

	const { clear, refresh } = useQueue();

	const deleteAll = async () => {
		// eslint-disable-next-line drizzle/enforce-delete-with-where
		await db
			.delete(schema.contentItems)
			.then((res) => {
				toast.success(`Deleted ${res.rowsAffected} rows`, { position: "top-right" });
				clear();
				refresh();
			})
			.catch((e) => {
				toast.error(`Error deleting rows`, { description: e.message, position: "top-right" });
			});
	};

	return (
		<Button
			className={cn(
				"rounded-md border dark:border-destructive dark:bg-transparent dark:text-destructive",
				className,
			)}
			variant="outline"
			onClick={() => deleteAll()}
			{...props}
		>
			{children}
		</Button>
	);
};
