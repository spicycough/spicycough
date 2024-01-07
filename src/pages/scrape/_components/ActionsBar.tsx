import { useState, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { BulkAddDialog } from "./BulkAddDialog";
import { CardStackPlusIcon, PlusIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueue } from "../_hooks/useQueue";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Type, type Static } from "@sinclair/typebox";
import { typeboxResolver } from "@hookform/resolvers/typebox";

const FormSchema = Type.Object({
	urls: Type.String(),
});

type FormSchema = Static<typeof FormSchema>;

export const ActionsBar = ({ className }: ComponentPropsWithoutRef<"div">) => {
	const { clear, refresh } = useQueue();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<FormSchema>({
		resolver: typeboxResolver(FormSchema),
		defaultValues: { urls: "" },
	});
	const { control, handleSubmit } = form;

	const addNew = async (data: FormSchema) => {
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("urls", data.urls);
			const resp = await fetch("/api/content-items", {
				method: "POST",
				body: formData,
			});

			if (resp.ok) {
				toast.success(`Success`, { position: "top-right" });
				refresh();
			}
		} catch (err) {
			toast.error(`Error adding row`, {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		}

		setIsLoading(false);
	};

	const deleteAll = async () => {
		try {
			const resp = await fetch(`/api/content-items`, {
				method: "DELETE",
			});

			if (resp.ok) {
				const numRows = await resp.json();
				toast.success("Success", {
					description: `Deleted ${numRows} rows`,
					position: "top-right",
				});
				clear();
				refresh();
			}
		} catch (err) {
			toast.error(`Error`, {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		}

		setIsLoading(false);
	};

	return (
		<div className={cn("flex flex-none justify-between px-4", className)}>
			<span className="flex basis-1/3">
				<Form {...form}>
					<form
						method="POST"
						action="/api/content-items"
						onSubmit={handleSubmit(addNew)}
						className="contents space-x-4"
					>
						<FormField
							control={control}
							name="urls"
							render={({ field }) => (
								<FormItem>
									<FormMessage />
									<FormControl>
										<Input
											className="w-full invalid:border-pink-500 invalid:text-pink-600"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit" variant="ghost" className="rounded-md dark:bg-green-600">
							<PlusIcon className="" />
						</Button>
					</form>
				</Form>
			</span>
			<span className="flex space-x-2">
				<BulkAddDialog>
					<Button variant="outline" className="rounded-md dark:bg-gleam-700">
						<CardStackPlusIcon className="" />
					</Button>
				</BulkAddDialog>
				<Button
					className={cn("rounded-md dark:bg-destructive ", className)}
					variant="outline"
					onClick={() => deleteAll()}
				>
					{!isLoading ? <TrashIcon className="" /> : <ReloadIcon className="animate-spin" />}
				</Button>
			</span>
		</div>
	);
};
