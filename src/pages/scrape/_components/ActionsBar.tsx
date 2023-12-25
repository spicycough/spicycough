import type { ComponentPropsWithoutRef } from "react";
import { ListStartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BulkAddDialog } from "./BulkAddDialog";

export const ActionsBar = ({ className }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div className={cn("flex justify-end space-x-4 pr-4", className)}>
			<BulkAddDialog>
				<Button
					variant="outline"
					size="default"
					className="rounded-lg dark:bg-warmth-500 dark:text-midnight-800"
				>
					<ListStartIcon className="size-4" />
				</Button>
			</BulkAddDialog>
		</div>
	);
};
