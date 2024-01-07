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
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { useForm } from "react-hook-form";
import { type ContentItem, insertContentItemSchema } from "@/db/schema";
import { type Static } from "@sinclair/typebox";
import { contentItems } from "database/migrations/schema";
import { Input } from "@/components/ui/input";
import { useDatabase } from "@/db/useDatabase";
import { eq } from "drizzle-orm";
import { CircleIcon } from "@radix-ui/react-icons";
import { match } from "ts-pattern";
import { useState, type PropsWithChildren } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueue } from "../_hooks/useQueue";

type EditDialogProps = PropsWithChildren<{
	contentItem: ContentItem;
}>;

export const EditDialog = ({ contentItem, children }: EditDialogProps) => {
	const form = useForm<Static<typeof insertContentItemSchema>>({
		resolver: typeboxResolver(insertContentItemSchema),
		defaultValues: contentItem,
	});

	const { db, schema } = useDatabase();
	const { refresh } = useQueue();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit = async (values: Static<typeof insertContentItemSchema>) => {
		const { id, ...rest } = values;

		db.update(schema.contentItems)
			.set(rest)
			.where(eq(contentItems.id, id!))
			.returning()
			.execute()
			.then((result) => {
				if (result[0]) {
					contentItem = result[0];
				}
			});

		setIsLoading(isLoading);
		refresh();
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="flex max-h-[75%] flex-col overflow-y-scroll sm:max-w-[425px] md:max-w-[680px]">
				<DialogHeader className="pb-4">
					<DialogTitle>Edit {contentItem.kind}</DialogTitle>
					{/*<DialogDescription></DialogDescription>*/}
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
										{/*<FormDescription>Description</FormDescription>*/}
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
										{/*<FormDescription>Description</FormDescription>*/}
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
										{/*<FormDescription>Description</FormDescription>*/}
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
										{/*<FormDescription>Description</FormDescription>*/}
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="pt-4">
								<Button type="submit" className="dark:bg-green-800 dark:text-white">
									{match(isLoading)
										.with(true, () => <CircleIcon />)
										.otherwise(() => "Submit")}
								</Button>
							</DialogFooter>
						</ScrollArea>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
