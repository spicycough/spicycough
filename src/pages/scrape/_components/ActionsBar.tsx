import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { BulkAddDialog } from "./BulkAddDialog";
import { DeleteAllButton } from "./DeleteAllButton";
import { CardStackPlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueue } from "../_hooks/useQueue";

export const ActionsBar = ({ className }: ComponentPropsWithoutRef<"div">) => {
	const { isEmpty } = useQueue();

	return (
		<div className={cn("flex flex-none justify-end space-x-4 pr-4", className)}>
			<BulkAddDialog>
				<Button
					variant="ghost"
					size="default"
					className="rounded-md dark:border dark:border-warmth-700 dark:text-warmth-500"
				>
					<CardStackPlusIcon className="m-2" />
				</Button>
			</BulkAddDialog>
			<DeleteAllButton disabled={isEmpty}>
				<TrashIcon className="m-2" />
			</DeleteAllButton>
		</div>
	);
};
