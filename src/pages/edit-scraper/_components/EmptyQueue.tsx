import { typeboxResolver } from "@hookform/resolvers/typebox";
import { ArrowRightIcon, MoonIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Type as tb } from "@sinclair/typebox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { H1, H3 } from "@/components/typography/h";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = tb.Object({
	urls: tb.String(),
});

export const EmptyQueue = () => {
	const form = useForm({
		resolver: typeboxResolver<typeof formSchema>(formSchema),
		defaultValues: { urls: "" },
	});

	const utils = trpcReact.useUtils();

	const { mutateAsync, isPending } = trpcReact.contentItem.bulkCreate.useMutation({
		onMutate: async () => {
			form.resetField("urls");
		},
		onSuccess: async (contentItems) => {
			toast.success("Success", {
				description: `Add ${contentItems.length} urls to queue`,
				position: "top-right",
			});
		},
		onError: async (err, urls) => {
			form.setValue("urls", urls.join("\n"));
			toast.error("Error", {
				description: err instanceof Error ? err.message : `Error fetching ${urls.length} urls`,
				position: "top-right",
			});
		},
		onSettled: async () => {
			await utils.contentItem.invalidate();
		},
	});

	const onSubmit = form.handleSubmit(
		async (data) => {
			const splitUrls = data.urls.split("\n");
			await mutateAsync(splitUrls);
		},
		({ root: err }) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : `Error creating ${form.getValues().urls}`,
				position: "top-right",
			});
		},
	);

	return (
		<div className="flex h-full w-full flex-col justify-around gap-y-20">
			<div className="flex flex-col items-center space-y-10">
				<MoonIcon className="h-20 w-20 text-gray-300" />
				<div className="flex flex-col items-center space-y-6">
					<H1 className="text-gray-300">No items in queue</H1>
					<H3 className="text-gray-500">Items added to the queue will appear here</H3>
				</div>
			</div>
			<Form {...form}>
				<form className="flex w-full items-center" onSubmit={onSubmit}>
					<div className="w-1/5"></div>
					<FormField
						control={form.control}
						name="urls"
						render={({ field }) => (
							<FormItem className="basis-3/5 align-baseline">
								<FormMessage />
								<FormControl>
									<Textarea
										placeholder="Enter urls to scrape, one per line"
										className="resize-none rounded-sm border border-dashed font-display dark:border-fog-400 dark:focus-visible:border-none"
										{...field}
										onChange={(e) => field.onChange(e.target.value.split("\n"))}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<div className="flex w-1/5 justify-center">
						<Button
							type="submit"
							variant="ghost"
							size="icon"
							className="size-12 rounded-full dark:bg-fog-900/65"
							onClick={(e) => e.stopPropagation()}
						>
							{!isPending ? (
								<ArrowRightIcon className="size-6" />
							) : (
								<UpdateIcon className="size-6 animate-spin" />
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
