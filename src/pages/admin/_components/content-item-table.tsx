import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { Button } from "@/components/ui/button";
import { DataTable, getDataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import type { ContentItem } from "@/db/schema";

import { columns } from "./columns";

export const ContentItemTable = () => {
	const { data: contentItems } = trpcReact.contentItem.all.useQuery();
	if (!contentItems) {
		return null;
	}

	const table = getDataTable({ columns, data: contentItems });

	return (
		<div className="container">
			<div className="flex justify-between py-2">
				<Input
					placeholder="Filter ..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
					className="w-[150px] lg:w-[250px]"
				/>
				<div className="flex justify-between">
					{table.getIsSomeRowsSelected() && (
						<BulkActionsRow
							selectedContentItems={table
								.getFilteredSelectedRowModel()
								.rows.map((row) => row.original)}
						/>
					)}
				</div>
			</div>
			<DataTable table={table} />
			<div className="flex h-10 min-h-6 items-center justify-between py-2 first:*:pl-4 last:*:pr-4">
				<div className="text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			</div>
		</div>
	);
};

const BulkActionsRow = ({ selectedContentItems }: { selectedContentItems: ContentItem[] }) => {
	const utils = trpcReact.useUtils();

	const { mutateAsync: refreshContentItem, isPending: isRefreshing } =
		trpcReact.contentItem.refresh.useMutation({
			onMutate: async () => {
				utils.contentItem.byId.refetch();
			},
			onSuccess: async () => toast.success("Refreshed", { position: "top-right" }),
			onError: async (err) => {
				toast.error("Error", {
					description: err instanceof Error ? err.message : "Unknown error",
					position: "top-right",
				});
			},
			onSettled: async () => {},
		});

	const { mutateAsync: deleteContentItem, isPending: isDeleting } =
		trpcReact.contentItem.remove.useMutation({
			onMutate: async () => {
				utils.contentItem.byId.refetch();
			},
		});

	return (
		<div className="flex items-center justify-between">
			<Button
				variant="ghost"
				size="icon"
				disabled={isRefreshing}
				className="size-4 stroke-fog-400/25 hover:stroke-radiance-400/50"
			>
				<UpdateIcon
					onClick={() => {
						Promise.all(
							selectedContentItems.map((contentItem) => refreshContentItem(contentItem.id)),
						);
					}}
					className={isRefreshing ? "animate-spin" : ""}
				/>
			</Button>
			<Button
				variant="ghost"
				size="icon"
				disabled={isDeleting}
				className="size-4 stroke-fog-400/25 hover:stroke-slate-400/50"
			>
				<TrashIcon
					onClick={() => {
						Promise.all(
							selectedContentItems.map((contentItem) => deleteContentItem(contentItem.id)),
						);
					}}
				/>
			</Button>
		</div>
	);
};
