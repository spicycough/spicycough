import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@/db/schema";
import {
	CalendarIcon,
	EnterFullScreenIcon,
	InfoCircledIcon,
	Link2Icon,
} from "@radix-ui/react-icons";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "../ui/separator";
import { Arrow } from "@radix-ui/react-hover-card";

type ContentItemCardProps = {
	item?: ContentItem;
	withAbstract?: boolean;
};

const emptyContentItem = { title: "", authors: "", abstract: "", publishedAt: "", permalink: "" };

export const ContentItemCard = ({ item, withAbstract = true }: ContentItemCardProps) => {
	const { title, authors, abstract, publishedAt, permalink } = item ?? emptyContentItem;

	const fmtdPublishedAt = new Date(publishedAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
	});

	return (
		<Card className={`flex flex-col overflow-hidden border-none`}>
			<CardHeader className="">
				<CardTitle>{title}</CardTitle>
				<CardDescription>
					{authors}
					<br />
					{fmtdPublishedAt}
				</CardDescription>
			</CardHeader>
			<CardContent className="">
				{withAbstract && <div className="whitespace-pre-wrap break-words">{abstract}</div>}
			</CardContent>
			<CardFooter className="justify-between">
				<DetailsHoverCard title={title} permalink={permalink} />

				<Button variant="ghost" size="icon">
					<a href={permalink}>
						<EnterFullScreenIcon />
					</a>
				</Button>
			</CardFooter>
		</Card>
	);
};

const DetailsHoverCard = ({ title, permalink }: Partial<ContentItem>) => {
	return (
		<HoverCard>
			<HoverCardTrigger>
				<InfoCircledIcon />
			</HoverCardTrigger>
			<HoverCardContent className="border-dashed" side="right" arrowPadding={5}>
				<Arrow />
				<div className="flex flex-col space-y-2">
					<div className="flex flex-row space-x-2">
						<Link2Icon />
						<p className="">{permalink}</p>
					</div>
					<Separator className="" />
					<div className="flex flex-row space-x-2">
						<CalendarIcon />
						<p className="text-sm text-gray-500">April 16, 2022</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

type ThumbnailsProps = {
	url: string;
	alt: string;
};

export const Thumbnail = ({ url, alt }: ThumbnailsProps) => {
	const [w, h] = [150, 100];

	return (
		<AspectRatio ratio={w / h}>
			<img src={url} alt={alt} className={`max-h-auto max-w-full h-[${h}px] w-[${w}px]`} />
		</AspectRatio>
	);
};
