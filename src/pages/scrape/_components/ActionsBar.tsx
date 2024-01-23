import { CardStackPlusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { DeleteAllButton } from "./Actions/DeleteAllButton";
import { NewContentItemForm } from "./Actions/NewContentItemForm";
import { BulkAddDialog } from "./BulkAddDialog";

export const ActionsBar = ({ className }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div className={cn("flex flex-none justify-between", className)}>
			<span className="flex flex-grow flex-nowrap">
				<NewContentItemForm className="invalid:border-rose-700 invalid:text-rose-700">
					<PlusIcon className="mx-2" />
				</NewContentItemForm>
			</span>

			<span className="flex space-x-2">
				<BulkAddDialog>
					<Button variant="outline" className="rounded-md dark:bg-fog-700">
						<CardStackPlusIcon className="mx-2" />
					</Button>
				</BulkAddDialog>
				<DeleteAllButton variant="outline" className="mx-2 rounded-md dark:bg-rose-700">
					<TrashIcon className="mx-2" />
				</DeleteAllButton>
			</span>
		</div>
	);
};
