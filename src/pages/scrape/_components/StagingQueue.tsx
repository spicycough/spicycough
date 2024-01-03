import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import type { ContentItem } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type Table as TableType,
} from "@tanstack/react-table";
import { useMemo, type PropsWithChildren, type HTMLAttributes, useEffect } from "react";
import { P, match } from "ts-pattern";
import { useQueue } from "../_hooks/useQueue";
import { Skeleton } from "@/components/ui/skeleton";
import { EditDialog } from "./EditDialog";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

type Table = TableType<ContentItem>;

type Columns = ColumnDef<ContentItem>[];

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
				<TableCell key={id} className="h-20 max-h-24 min-h-10 text-center">
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
					<h1 className="text-left text-xl font-bold text-gray-500">{row.getValue("title")}</h1>
				),
			},
			{
				accessorKey: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<EditDialog contentItem={row.original}>
						<Button
							variant="outline"
							size="icon"
							className="rounded-lg dark:bg-warmth-500 dark:text-midnight-800"
							onClick={(e) => e.stopPropagation()}
						>
							<Pencil1Icon className="size-4" />
						</Button>
					</EditDialog>
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
			<TableFooter className="bg-transparent hover:bg-transparent dark:bg-transparent hover:dark:bg-transparent">
				<TableRow className="">
					<TableCell colSpan={columns.length} className="">
						{children}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};
