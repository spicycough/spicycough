import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { ContentItem } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type Table as TableType,
} from "@tanstack/react-table";
import {
	useMemo,
	type PropsWithChildren,
	type HTMLAttributes,
	useEffect,
	useCallback,
} from "react";
import { P, match } from "ts-pattern";
import { useQueue } from "../_hooks/useQueue";
import { Skeleton } from "@/components/ui/skeleton";
import { EditDialog } from "./EditDialog";
import { Button } from "@/components/ui/button";
import { Component1Icon, Pencil1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

type Table = TableType<ContentItem>;

type Columns = ColumnDef<ContentItem>[];

const EmptyRow = ({ numCols, children }: PropsWithChildren<{ numCols: number }>) => (
	<TableRow>
		<TableCell colSpan={numCols} className="h-72 text-center">
			{children}
		</TableCell>
	</TableRow>
);

const Rows = ({ table }: { table: Table }) =>
	table.getRowModel().rows.map((row) => (
		<TableRow
			key={row.id}
			data-state={row.getIsSelected() && "selected"}
			onClick={row.getToggleSelectedHandler()}
			className="flex justify-between"
		>
			{row.getVisibleCells().map(({ id, column, getContext }) => (
				<TableCell key={id} className="text-left">
					{flexRender(column.columnDef.cell, getContext())}
				</TableCell>
			))}
		</TableRow>
	));

export const StagingQueue = ({ className }: HTMLAttributes<HTMLDivElement>) => {
	const { data, error, refresh, isLoading, setSelected } = useQueue();

	const refreshContentItem = useCallback(async (id: string) => {
		const url = new URL("/api/scrape");
		url.searchParams.append("ids", id);

		return await fetch(url, {
			method: "POST",
		})
			.then((res) => {
				if (res.ok) {
					refresh();
					toast.success("Content item refreshed");
				}
			})
			.catch((err) => {
				toast.error(`Failed to refresh content item: ${err.message}`);
			});
	}, []);

	const columns: Columns = useMemo(
		() => [
			{
				accessorKey: "title",
				header: "Title",
				cell: ({ row }) => (
					<div className="flex-auto">
						<h1 className="text-left text-xl font-bold text-gray-500">{row.getValue("title")}</h1>
					</div>
				),
			},
			{
				accessorKey: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex flex-none items-center space-x-2">
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
						<Button
							size="icon"
							variant="ghost"
							className="rounded-md dark:text-radiance-500"
							onClick={() => refreshContentItem(row.id)}
						>
							<ReloadIcon />
						</Button>
					</div>
				),
			},
		],
		[],
	);

	const table = useReactTable<ContentItem>({
		data,
		columns,
		enableMultiRowSelection: false,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id.toString(),
		debugTable: false,
	});

	useEffect(() => {
		const updateSelected = () => {
			const selectedIds = table.getSelectedRowModel().flatRows.map(({ original }) => original.id);
			const selectedRow = data.find(({ id }) => selectedIds.includes(id));
			setSelected(selectedRow ?? null);
		};

		updateSelected();
	}, [table.getSelectedRowModel().flatRows, data]);

	const isEmpty = useMemo(() => table.getRowModel().rows?.length === 0, [table.getRowModel().rows]);

	if (isLoading) {
		return <Skeleton />;
	}

	const Body = () =>
		match({ data, error, isLoading, isEmpty })
			.with({ isEmpty: true }, () => (
				<EmptyRow numCols={columns.length}>
					<span className="flex w-full items-center justify-center gap-2">
						<Component1Icon />
						<p className="font-light uppercase text-accent-foreground dark:text-opacity-35">
							Nothing in queue
						</p>
					</span>
				</EmptyRow>
			))
			.with({ error: P.not(P.nullish) }, () => (
				<EmptyRow numCols={columns.length}>{error?.message}</EmptyRow>
			))
			.otherwise(() => <Rows table={table} />);

	return (
		<Table className={cn("", className)}>
			<TableBody className="">
				<Body />
			</TableBody>
		</Table>
	);
};
