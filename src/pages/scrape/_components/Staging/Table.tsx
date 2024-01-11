import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import type { ContentItem } from "@/db/schema";
import { cn } from "@/lib/utils";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type HTMLAttributes, type Dispatch, type SetStateAction } from "react";
import { columns } from "./Columns";
import { trpcReact } from "@/client";

interface QueueProps extends HTMLAttributes<HTMLDivElement> {
	selected: ContentItem | null;
	setSelected: Dispatch<SetStateAction<ContentItem | null>>;
}

export const Queue = ({ setSelected, className }: QueueProps) => {
	const { data } = trpcReact.contentItem.get.useQuery();

	const table = useReactTable<ContentItem>({
		data: data ?? [],
		columns,
		enableMultiRowSelection: false,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id.toString(),
		debugTable: false,
	});

	return (
		<Table className={cn("", className)}>
			<TableBody className="">
				{table.getRowModel().rows.length !== 0 ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
							onClick={() => {
								row.toggleSelected();
								setSelected(row.original);
							}}
							className="flex items-center justify-center space-x-2 align-middle"
						>
							{row.getVisibleCells().map(({ id, column, getContext }) => (
								<TableCell key={id} className="h-20">
									{flexRender(column.columnDef.cell, getContext())}
								</TableCell>
							))}
							<Separator orientation="vertical" />
						</TableRow>
					))
				) : (
					<TableRow className="hover:bg-transparent dark:hover:bg-transparent">
						<TableCell colSpan={columns.length} className="h-20 text-center">
							No content items in queue
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
