import type { HTMLAttributes } from "astro/types";

// import { makeRequest } from "@/lib/gpt";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { CheckIcon, ChevronRightIcon, Cross2Icon } from "@radix-ui/react-icons";

import { type ContentItem } from "@/db/schema/contentItems";
import { useState } from "react";

export interface Props extends HTMLAttributes<"div"> {}

// const url = "https://www.nature.com/articles/s41584-023-00964-y";

const ApproveButton = () => (
	<Button variant="ghost" className="rounded-lg bg-green-600 hover:bg-green-700">
		<CheckIcon className="size-4 text-card-foreground" />
		<span className="sr-only">Approve</span>
	</Button>
);

const DenyButton = () => (
	<Button variant="destructive" className="hover:bg-destructive-[100] rounded-lg bg-destructive">
		<Cross2Icon className="text-primary-background size-4" />
		<span className="sr-only">Deny</span>
	</Button>
);

const SummaryText = ({ fullText }: { fullText: string }) => {
	// const client = createClient({});

	// const [text, setText] = useState("");

	// useEffect(() => {
	// 	const run = async () => {
	// 		const { text } = await makeRequest(client, [
	// 			{ role: "user", content: "Summarize the following text\n" + fullText ?? "" },
	// 		]);
	// 		setText(text);
	// 	};
	// 	run();
	// }, [client]);

	return <p>{fullText ?? "Text"}</p>;
};

export const ContentItemCard = (contentItem?: ContentItem) => {
	const { title, authors, publishedAt, fullText } = contentItem ?? {};

	const [responseMessage, setResponseMessage] = useState("");

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const response = await fetch("/api/feedback", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (data.message) {
			setResponseMessage(data.message);
		}
	}

	return (
		<Card className="flex h-full flex-col bg-gradient-to-b from-twilight-800 to-twilight-900">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription className="italic">{authors?.split("\n").join(", ")}</CardDescription>
				<div className="text-sm text-gray-500">{publishedAt}</div>
			</CardHeader>
			<Separator />
			<CardContent className="grid h-full grid-cols-[1fr,min-content,1fr] gap-3 pt-6">
				<div className="overflow-y-scroll rounded-lg p-1 pl-3">
					<h2 className="font-bold text-white opacity-100">Abstract</h2>
					<p>{fullText}</p>
				</div>
				<Separator orientation="vertical" className="h-full self-stretch" />
				<div className="overflow-y-scroll rounded-lg p-1 pl-3">
					<h2 className="font-bold text-white">Summary</h2>
					<SummaryText fullText={fullText!} />
				</div>
			</CardContent>
			<Separator />
			<CardFooter className="pt-6">
				<form onSubmit={submit} className="flex w-full items-center justify-between">
					<div className="flex w-2/5 gap-4">
						<Input
							type="text"
							name="url"
							className="text-base placeholder:opacity-60"
							placeholder="Enter an article..."
						/>
						<Button type="submit" variant="secondary" className="rounded-lg">
							<ChevronRightIcon />
						</Button>
					</div>
					<div className="flex gap-x-4">
						<DenyButton />
						<ApproveButton />
					</div>
				</form>
			</CardFooter>
		</Card>
	);
};
