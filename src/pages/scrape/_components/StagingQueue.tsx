import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ContentItemStaging } from "@/db/schema/contentItems";
import { cn } from "@/lib/utils";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type Table as TableType,
	type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, type PropsWithChildren, type HTMLAttributes, useEffect, useState } from "react";
import { P, match } from "ts-pattern";
import { useQueue } from "../_hooks/useQueue";
import { Skeleton } from "@/components/ui/skeleton";

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

type Table = TableType<ContentItemStaging>;

type Columns = ColumnDef<ContentItemStaging>[];

const Heading = ({ table }: { table: Table }) =>
	table.getHeaderGroups().map((headerGroup) => (
		<TableRow key={headerGroup.id}>
			{headerGroup.headers.map((header) => (
				<TableHead key={header.id}>
					{!header.isPlaceholder
						? flexRender(header.column.columnDef.header, header.getContext())
						: null}
				</TableHead>
			))}
		</TableRow>
	));

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
		>
			{row.getVisibleCells().map(({ id, column, getContext }) => (
				<TableCell key={id} className="h-24 text-center">
					{flexRender(column.columnDef.cell, getContext())}
				</TableCell>
			))}
		</TableRow>
	));

export const StagingQueue = ({
	className,
	children,
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
	const { data, error, isLoading, setSelected } = useQueue();

	const columns: Columns = useMemo(
		() => [
			{
				accessorKey: "title",
				header: "Title",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<h1 className="text-gray-500">{row.getValue("title")}</h1>
					</div>
				),
			},
			{
				accessorKey: "publisher",
				header: "Publisher",
			},
			{
				accessorKey: "actions",
				header: "Actions",
			},
		],
		[],
	);

	const table = useReactTable<ContentItemStaging>({
		data,
		columns,
		enableMultiRowSelection: false,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id.toString(),
		debugTable: true,
	});

	useEffect(() => {
		const selectedIds = table.getSelectedRowModel().flatRows.map(({ original }) => original.id);
		const selectedRow = data.find(({ id }) => selectedIds.includes(id));
		setSelected(selectedRow ?? null);
	}, [table.getSelectedRowModel().flatRows, data]);

	const isEmpty = useMemo(() => table.getRowModel().rows?.length === 0, [table.getRowModel().rows]);

	if (isLoading) {
		return <Skeleton />;
	}

	const Body = () =>
		match({ data, error, isLoading, isEmpty })
			.with({ isEmpty: true }, () => (
				<EmptyRow numCols={columns.length}>Nothing in queue.</EmptyRow>
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
			<TableFooter className="bg-transparent dark:bg-transparent">
				<TableRow className="">
					<TableCell colSpan={columns.length} className="">
						{children}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};
