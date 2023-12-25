import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
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
} from "@tanstack/react-table";
import { useCallback, useMemo, type ComponentPropsWithoutRef, type PropsWithChildren } from "react";
import { P, match } from "ts-pattern";
import { useQueue } from "../_hooks/useQueue";

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
		<TableCell colSpan={numCols} className="h-24 text-center">
			{children}
		</TableCell>
	</TableRow>
);

const Rows = ({ table }: { table: Table }) =>
	table.getRowModel().rows.map((row) => (
		<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
			{row.getVisibleCells().map(({ id, column, getContext }) => (
				<TableCell key={id} className="h-24 text-center">
					{flexRender(column.columnDef.cell, getContext())}
				</TableCell>
			))}
		</TableRow>
	));

export const Queue = ({ className }: ComponentPropsWithoutRef<"div">) => {
	const columns: Columns = [
		{
			accessorKey: "selection",
			header: "",
			cell: ({ row }) => {
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>;
			},
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => (
				<div className="flex flex-col">
					<div className="text-sm text-gray-500">{row.getValue("sourceUrl")}</div>
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
	];

	const { data, error, isLoading, rowSelection, setRowSelection } = useQueue();

	const table = useReactTable<ContentItemStaging>({
		data,
		columns,
		state: { rowSelection },
		enableRowSelection: true, //enable row selection for all rows
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		debugTable: true,
	});

	const isEmpty = useMemo(() => table.getRowModel().rows?.length === 0, [table.getRowModel().rows]);

	const Body = useCallback(
		() =>
			match({ data, error, isLoading, isEmpty })
				// .with({ isLoading: true }, () => <Skeleton />)
				.with({ isEmpty: true }, () => <EmptyRow numCols={columns.length}>No results.</EmptyRow>)
				.with({ error: P.not(P.nullish) }, () => (
					<EmptyRow numCols={columns.length}>{error?.message}</EmptyRow>
				))
				.otherwise(() => <Rows table={table} />),
		[data, error, isLoading, isEmpty, columns.length, table],
	);

	return (
		<Table className={cn("", className)}>
			<TableHeader>
				<Heading table={table} />
			</TableHeader>
			<TableBody>
				<Body />
			</TableBody>
		</Table>
	);
};
