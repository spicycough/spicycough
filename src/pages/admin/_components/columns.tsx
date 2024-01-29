import { typeboxResolver } from "@hookform/resolvers/typebox";
import { CaretRightIcon, CircleBackslashIcon, PlusIcon } from "@radix-ui/react-icons";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Type as tb } from "@sinclair/typebox";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ContentItem } from "@/db/schema";

import { RowActions } from "./row-actions";

export const columns: ColumnDef<ContentItem>[] = [
	{
		id: "select",
		enableSorting: false,
		enableHiding: false,
		header: ({ table }) => (
			<>
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			</>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
	},
	{
		accessorKey: "title",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
		cell: ({ row }) => <a href={`${row.original.permalink}`}>{row.original.title}</a>,
	},
	{
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
		accessorKey: "kind",
		cell: ({ row }) => <Badge className="uppercase opacity-35">{row.original.kind}</Badge>,
	},
	{
		header: ({ column }) => <DataTableColumnHeader column={column} title="Authors" />,
		accessorKey: "authors",
		cell: ({ row }) => {
			const { authors } = row.original;
			const mainAuthor = authors?.[0];

			return (
				<>
					<p>{mainAuthor}</p>
					{mainAuthor ? (
						<p className="opacity-50">et al.</p>
					) : (
						<p className="opacity-50">Unknown</p>
					)}
				</>
			);
		},
	},
	{
		header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
		accessorKey: "publishedAt",
		cell: ({ row }) => {
			const dt = new Date(row.original.publishedAt).toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});

			return <p className="text-sm">{dt}</p>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		enableSorting: false,
		header: ({ table }) => {
			const formSchema = tb.Object({
				url: tb.String(),
			});

			const form = useForm({
				resolver: (data, context, x) => {
					return typeboxResolver<typeof formSchema>(formSchema)(data, context, x);
				},
				defaultValues: { url: "" },
			});

			const utils = trpcReact.useUtils();

			const { mutateAsync: createContentItem } = trpcReact.contentItem.create.useMutation({
				onMutate: async () => {
					utils.contentItem.byId.refetch();
				},
				onSuccess: async () => toast.success("Created", { position: "top-right" }),
				onError: async (err) => {
					toast.error("Error", {
						description: err instanceof Error ? err.message : "Unknown error",
						position: "top-right",
					});
				},
				onSettled: async () => {},
			});

			return (
				<div className="flex justify-end">
					<Popover>
						<PopoverTrigger>
							<Button variant="outline" size="sm" className="rounded-md">
								<PlusIcon className="mr-2" />
								Add
							</Button>
						</PopoverTrigger>
						<PopoverContent className="flex w-[24rem]" align="end" side="top">
							<Form {...form}>
								<form
									className="flex w-full justify-end space-x-4"
									onSubmit={async () =>
										form.handleSubmit(await createContentItem(form.getValues().url))
									}
								>
									<FormField
										control={form.control}
										name="url"
										render={({ field }) => (
											<FormItem className="flex-grow">
												<FormControl>
													<Input placeholder="Enter url..." className="flex-grow p-2" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										variant="outline"
										size="icon"
										disabled={form.formState.isSubmitting || form.getValues().url === ""}
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										{form.getValues().url === "" ? <CircleBackslashIcon /> : <CaretRightIcon />}
									</Button>
								</form>
							</Form>
							<PopoverArrow />
						</PopoverContent>
					</Popover>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-end">
					<RowActions contentItem={row.original} />
				</div>
			);
		},
	},
];
