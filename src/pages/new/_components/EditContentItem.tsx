import { trpcReact } from "@/client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { insertContentItemSchema } from "@/db/schema";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { ReloadIcon } from "@radix-ui/react-icons";
import type { Static } from "@sinclair/typebox";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditableTextFormField } from "./EditableTextFormField";

type FormSchema = Static<typeof insertContentItemSchema>;
export const EditContentItem = () => {
	const form = useForm<FormSchema>({
		resolver: typeboxResolver(insertContentItemSchema),
	});

	const utils = trpcReact.useUtils();

	const {
		mutateAsync: updateContentItem,
		data,
		isPending,
	} = trpcReact.contentItem.update.useMutation({
		onMutate: async () => {},
		onSuccess: async () => {
			toast.success("Success", { position: "top-right" });
		},
		onError: async (err) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		},
		onSettled: async () => {},
	});

	const onSubmit = useCallback(() => {
		updateContentItem(form.getValues());
	}, []);

	return (
		<Form {...form}>
			<form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-2 p-2">
					<EditableTextFormField
						name="title"
						control={form.control}
						defaultValue="testo"
						onPersist={(field) => {
							toast.success(` Persisted ${field.value}`, { position: "top-right" });
						}}
					/>
					<FormField
						control={form.control}
						name="permalink"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input defaultValue={field.value} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="abstract"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea defaultValue={field.value ?? ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="fullText"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{field.name}</FormLabel>
								<FormControl>
									<ScrollArea>
										<Textarea defaultValue={field.value ?? ""} />
									</ScrollArea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						disabled={!!data || isPending}
						className="dark:bg-slate-800 dark:text-white"
						onClick={(e) => e.stopPropagation()}
					>
						{!isPending ? "Submit" : <ReloadIcon className="animate-spin" />}
					</Button>
				</div>
			</form>
		</Form>
	);
};
