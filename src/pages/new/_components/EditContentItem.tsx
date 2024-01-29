import { typeboxResolver } from "@hookform/resolvers/typebox";
import { ExternalLinkIcon, ReloadIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import type { Static } from "@sinclair/typebox";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import snarkdown from "snarkdown";
import { toast } from "sonner";

import { trpcReact } from "@/client";
import { H2 } from "@/components/typography/h";
import { P } from "@/components/typography/p";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type ContentItem, ContentItemKinds, insertContentItemSchema } from "@/db/schema";
import { cn } from "@/lib/utils";

type FormSchema = Static<typeof insertContentItemSchema>;

interface EditContentItemProps {
	contentItem: ContentItem;
}

export const EditContentItem = ({ contentItem }: EditContentItemProps) => {
	const form = useForm<FormSchema>({
		resolver: typeboxResolver(insertContentItemSchema),
		defaultValues: contentItem,
	});

	const {
		mutateAsync: updateContentItem,
		data,
		isPending,
	} = trpcReact.contentItem.update.useMutation({
		onSuccess: async () => toast.success("Success", { position: "top-right" }),
		onError: async (err) => {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Unknown error",
				position: "top-right",
			});
		},
	});

	const utils = trpcReact.useUtils();

	const { mutateAsync: refreshContentItem, isPending: isRefreshing } =
		trpcReact.contentItem.refresh.useMutation({
			onMutate: async () => {
				utils.contentItem.byId.refetch();
			},
			onSuccess: async () => toast.success("Refreshed", { position: "top-right" }),
			onError: async (err) => {
				toast.error("Error", {
					description: err instanceof Error ? err.message : "Unknown error",
					position: "top-right",
				});
			},
			onSettled: async () => {},
		});

	const { mutateAsync: deleteContentItem, isPending: isDeleting } =
		trpcReact.contentItem.remove.useMutation({
			onMutate: async () => {
				utils.contentItem.byId.refetch();
			},
		});

	const onSubmit = useCallback(() => {
		updateContentItem(form.getValues());
	}, []);

	return (
		<div className="container flex flex-col gap-y-40">
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="flex min-h-20 flex-col space-x-2">
								<H2 className="min-w-20 basis-full">{field.value}</H2>
								<FormControl>
									<div className="absolute right-1 flex space-x-4">
										<UpdateIcon
											onClick={() => refreshContentItem(contentItem.id)}
											className={cn(
												"size-4 stroke-fog-400/25 hover:stroke-radiance-400/50",
												isRefreshing && "animate-spin",
											)}
										/>
										<a href={form.getValues("permalink")}>
											<ExternalLinkIcon className="size-4 stroke-fog-400/25 hover:stroke-gleam-400" />
										</a>
										<TrashIcon
											onClick={() => deleteContentItem(contentItem.id)}
											className={cn("size-4 stroke-fog-400/25 hover:stroke-slate-400/50")}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="kind"
						render={({ field }) => (
							<FormItem className="min-h-20">
								<FormLabel className="font-display font-bold uppercase">{`Content ${field.name}`}</FormLabel>
								<FormControl>
									<Select defaultValue={field.value ?? ""}>
										<SelectTrigger className="w-[120px] uppercase">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{ContentItemKinds.map((kind) => (
												<SelectItem key={kind} value={kind} className="uppercase">
													{kind}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="authors"
						render={({ field }) => (
							<FormItem className="min-h-20">
								<FormLabel className="font-display font-bold uppercase">Author(s)</FormLabel>
								<FormControl>
									<P className="font-display font-bold uppercase underline underline-offset-2 dark:hover:text-opacity-25">
										{field.value}
									</P>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="abstract"
						render={({ field }) => (
							<FormItem className="max-h-80 min-h-20 overflow-y-scroll rounded-md border border-gray-200/25 p-4">
								<FormLabel className="font-display font-bold uppercase">{field.name}</FormLabel>
								<FormControl>
									<ScrollArea>
										{/*<div dangerouslySetInnerHTML={{ __html: snarkdown(field.value ?? "") }} />*/}
										<P>{field.value}</P>
									</ScrollArea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div dangerouslySetInnerHTML={{ __html: snarkdown(contentItem.fullText ?? "") }} />
					<Button
						type="submit"
						disabled={!!data || isPending}
						className="dark:bg-slate-800 dark:text-white"
						onClick={(e) => e.stopPropagation()}
					>
						{!isPending ? "Submit" : <ReloadIcon className="animate-spin" />}
					</Button>
				</form>
			</Form>
		</div>
	);
};
