import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Type, type Static } from "@sinclair/typebox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { createFakeContentItems } from "@/db/factories";

const FormSchema = Type.Object({
	url: Type.String(),
});

type FormSchema = Static<typeof FormSchema>;

export const NewContentItemForm = ({ className, children, ...props }: InputProps) => {
	const form = useForm<FormSchema>({
		resolver: typeboxResolver(FormSchema),
		defaultValues: { url: "" },
	});
	const { control, resetField, setValue } = form;

	const queryClient = useQueryClient();

	const utils = trpcReact.useUtils();

	const { mutateAsync: createContentItem, isPending } = trpcReact.contentItem.create.useMutation({
		onMutate: async () => {
			resetField("url");

			const queryKey = getQueryKey(trpcReact.contentItem.get);

			await queryClient.cancelQueries({ queryKey });

			const placeholder = createFakeContentItems(1);
			const prev = queryClient.getQueryData(queryKey);

			queryClient.setQueryData(queryKey, placeholder);

			return { prev, placeholder };
		},
		onSuccess: async (url) => {
			const description = `Created ${url?.slug}`;

			toast.success("Success", { description, position: "top-right" });
		},
		onError: async (err, url) => {
			setValue("url", url);
			const description = err instanceof Error ? err.message : `Error creating ${url}`;

			toast.error("Error", {
				description,
				position: "top-right",
			});
		},
		onSettled: async () => {
			utils.contentItem.invalidate();
		},
	});

	const hasText = form.getValues("url").length === 0;

	const onSubmit = async ({ url }: FormSchema) => {
		await createContentItem(url);
		form.reset();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full justify-stretch space-x-2"
			>
				<FormField
					control={control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormMessage />
							<FormControl>
								<Input
									placeholder="Enter a url to scrape..."
									className={cn("dark:placeholder-opacity-25", className)}
									{...field}
									{...props}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					variant="outline"
					disabled={hasText || isPending}
					className="rounded-md disabled:bg-fog-900 dark:bg-fog-700"
				>
					{!isPending ? children : <ReloadIcon className="mx-2 animate-spin" />}
				</Button>
			</form>
		</Form>
	);
};
