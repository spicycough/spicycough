import { ArrowRightIcon, MoonIcon, UpdateIcon } from "@radix-ui/react-icons";
import { trpcReact } from "@/client";
import { H1, H2, H3, H5 } from "@/components/typegraphy/h";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { toast } from "sonner";
import { useValidationSchema } from "@/db/schema/contentItems/validation";

export const EmptyQueue = () => {
	const { bulkCreate: validationSchema } = useValidationSchema();

	const form = useForm<typeof validationSchema>({
		resolver: typeboxResolver(validationSchema),
		defaultValues: {
			urls: "",
		},
	});

	const utils = trpcReact.useUtils();

	const { mutateAsync, isPending } = trpcReact.contentItem.bulkCreate.useMutation({
		onMutate: async () => {
			form.resetField("urls");
		},
		onSuccess: async (contentItems) => {
			toast.success("Success", {
				description: `Created ${contentItems.length} entries`,
				position: "top-right",
			});
		},
		onError: async (err, urls) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : `Error creating ${urls}`,
				position: "top-right",
			});
			form.setValue("urls", urls);
		},
		onSettled: async () => {
			utils.contentItem.invalidate();
		},
	});

	const onSubmit = form.handleSubmit(
		async (data) => await mutateAsync({ urls: data.urls }),
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
							onClick={(e) => {
								e.stopPropagation();
								console.log("clicked");
							}}
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
