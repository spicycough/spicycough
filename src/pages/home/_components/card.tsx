import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import { match } from "ts-pattern";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ContentItem } from "@/db/schema";

type CardSize = "small" | "medium" | "large";

interface CardProps {
	contentItem: ContentItem;
	size?: CardSize;
}

export const ContentItemCard = ({ contentItem, size = "medium" }: CardProps) => {
	return match(size)
		.with("small", () => <SmallCard contentItem={contentItem} />)
		.with("medium", () => <MediumCard contentItem={contentItem} />)
		.with("large", () => <LargeCard contentItem={contentItem} />)
		.exhaustive();
};

type LargeCardProps = React.PropsWithChildren<{
	contentItem: ContentItem;
}>;

export const LargeCard = ({ contentItem }: LargeCardProps) => {
	const fmtPublishedAt = new Date(contentItem?.publishedAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
	});

	return (
		<Card className={`flex flex-col rounded-2xl border border-slate-800`}>
			{contentItem?.imageUrl && (
				<img
					src={contentItem?.imageUrl}
					alt={contentItem.title}
					className="rounded-t-2xl object-cover"
				/>
			)}
			<CardHeader className="">
				<CardTitle>{contentItem?.title}</CardTitle>
				<CardDescription>
					{contentItem.authors}
					<br />
					{fmtPublishedAt}
				</CardDescription>
			</CardHeader>
			<CardContent className="">
				<p className="whitespace-pre-wrap break-words">{contentItem.abstract}</p>
			</CardContent>
			<CardFooter className="justify-end">
				<Button variant="ghost" size="icon">
					<a href={contentItem.permalink}>
						<EnterFullScreenIcon />
					</a>
				</Button>
			</CardFooter>
		</Card>
	);
};

type MediumCardProps = React.PropsWithChildren<{
	contentItem: ContentItem;
}>;

export const MediumCard = ({ contentItem }: MediumCardProps) => {
	const fmtPublishedAt = new Date(contentItem.publishedAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
	});

	return (
		<Card className={`flex flex-col border`}>
			<CardHeader className="flex">
				<CardTitle>{contentItem.title}</CardTitle>
				<CardDescription>
					{contentItem.authors}
					<br />
					{fmtPublishedAt}
				</CardDescription>
			</CardHeader>
			<CardContent className="">
				<p className="">{contentItem.abstract}</p>
			</CardContent>
			<CardFooter className="justify-end">
				<Button variant="ghost" size="icon">
					<a href={contentItem.permalink}>
						<EnterFullScreenIcon />
					</a>
				</Button>
			</CardFooter>
		</Card>
	);
};

type SmallCardProps = React.PropsWithChildren<{
	contentItem: ContentItem;
}>;

export const SmallCard = ({ contentItem }: SmallCardProps) => {
	return (
		<Card className={`flex flex-col border`}>
			<CardHeader className="flex">
				<CardTitle>{contentItem.title}</CardTitle>
				<CardDescription>{contentItem.authors}</CardDescription>
			</CardHeader>
			<CardFooter className="justify-end p-3">
				<Button variant="ghost" size="icon">
					<a href={contentItem.permalink}>
						<EnterFullScreenIcon />
					</a>
				</Button>
			</CardFooter>
		</Card>
	);
};
