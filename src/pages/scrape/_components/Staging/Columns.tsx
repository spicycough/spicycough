import { Pencil1Icon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import { type HTMLAttributes } from "react";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/db/schema";

import { EditDialog } from "../EditDialog";

export type Columns = ColumnDef<ContentItem>[];

export const columns: Columns = [
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<div className="flex-auto">
				<h2 className="overflow-hidden text-ellipsis text-left text-lg text-gray-500">
					{row.getValue("title")}
				</h2>
			</div>
		),
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<>
				<div className="flex flex-none">
					<EditButton row={row} />
					<RefreshButton row={row} />
					<RemoveButton row={row} />
				</div>
			</>
		),
	},
];

type EditButtonProps = HTMLAttributes<HTMLButtonElement> & { row: Row<ContentItem> };

const EditButton = ({ row }: EditButtonProps) => (
	<EditDialog contentItem={row.original}>
		<Button
			size="icon"
			variant="ghost"
			className="rounded-md dark:text-fog-400"
			onClick={(e) => e.stopPropagation()}
		>
			<Pencil1Icon className="" />
		</Button>
	</EditDialog>
);

type RefreshButtonProps = HTMLAttributes<HTMLButtonElement> & { row: Row<ContentItem> };

const RefreshButton = ({ row }: RefreshButtonProps) => {
	const { mutate: refreshContentItem } = trpcReact.contentItem.refresh.useMutation({
		onMutate: () => {},
		onSuccess: () => {
			toast.success("Success", {
				description: "Refreshed content item",
				position: "top-right",
			});
		},
		onError: (err) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		},
		onSettled: () => {},
	});

	return (
		<Button
			size="icon"
			variant="ghost"
			className="rounded-md dark:text-radiance-500"
			onClick={(e) => {
				e.stopPropagation();
				refreshContentItem(row.getValue("permalink"));
			}}
		>
			<ReloadIcon />
		</Button>
	);
};

type RemoveButtonProps = HTMLAttributes<HTMLButtonElement> & { row: Row<ContentItem> };

const RemoveButton = ({ row }: RemoveButtonProps) => {
	// eslint-disable-next-line drizzle/enforce-delete-with-where
	const { mutate: deleteContentItem } = trpcReact.contentItem.remove.useMutation({
		onMutate: () => {},
		onSuccess: () => {
			toast.success("Success", {
				description: "Deleted content item",
				position: "top-right",
			});
		},
		onError: (err) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		},
		onSettled: () => {},
	});

	return (
		<Button
			size="icon"
			variant="ghost"
			className="rounded-md dark:text-destructive"
			onClick={(e) => {
				e.stopPropagation();
				deleteContentItem(row.id);
			}}
		>
			<TrashIcon />
		</Button>
	);
};
