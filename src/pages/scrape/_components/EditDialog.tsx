import { trpcReact } from "@/client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { insertContentItemSchema, type ContentItem } from "@/db/schema";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { ReloadIcon } from "@radix-ui/react-icons";
import { type Static } from "@sinclair/typebox";
import { type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditDialogProps = PropsWithChildren<{
	contentItem: ContentItem;
}>;

type FormSchema = Static<typeof insertContentItemSchema>;

export const EditDialog = ({ contentItem, children }: EditDialogProps) => {
	const form = useForm<FormSchema>({
		resolver: typeboxResolver(insertContentItemSchema),
		defaultValues: contentItem,
	});

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

	const onSubmit = async (data: FormSchema) => {
		await updateContentItem(data);
		form.reset();
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="flex max-h-[75%] flex-col overflow-y-scroll sm:max-w-[425px] md:max-w-[680px]">
				<DialogHeader className="pb-4">
					<DialogTitle>Edit {contentItem.kind}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
						<ScrollArea>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{field.name}</FormLabel>
										<FormControl>
											<Input defaultValue={field.value} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="permalink"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{field.name}</FormLabel>
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
										<FormLabel>{field.name}</FormLabel>
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
							<DialogFooter className="pt-4">
								<Button
									type="submit"
									disabled={!!data || isPending}
									className="dark:bg-green-800 dark:text-white"
									onClick={(e) => e.stopPropagation()}
								>
									{!isPending ? "Submit" : <ReloadIcon className="animate-spin" />}
								</Button>
							</DialogFooter>
						</ScrollArea>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
