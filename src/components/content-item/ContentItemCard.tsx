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
import type { ContentItem } from "@/db/schema/contentItems";
import {
	CalendarIcon,
	EnterFullScreenIcon,
	InfoCircledIcon,
	Link2Icon,
} from "@radix-ui/react-icons";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "../ui/separator";

type ContentItemCardProps = {
	item: ContentItem;
	rowSpan?: number;
	colSpan?: number;
	isSelected?: boolean;
};

export const ContentItemCard = ({
	item,
	rowSpan = 1,
	colSpan = 1,
	isSelected = false,
}: ContentItemCardProps) => {
	const { title, authors, abstract, publishedAt, sourceUrl } = item;

	const fmtdPublishedAt = new Date(publishedAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
	});

	return (
		<Card
			className={`h-full overflow-hidden row-span-${rowSpan} col-span-${colSpan} data-[${
				isSelected && "selected"
			}]`}
		>
			<CardHeader className="">
				<CardTitle>{title}</CardTitle>
				<CardDescription>
					<div className="flex flex-row justify-between">
						<p className="font-bold">{authors}</p>
						{fmtdPublishedAt}
					</div>
				</CardDescription>
			</CardHeader>
			<CardContent className="">
				<div className="flex flex-col whitespace-pre-wrap break-words">{abstract}</div>
			</CardContent>
			<CardFooter className="justify-end">
				<div className="flex w-full flex-row justify-between">
					<HoverCard>
						<HoverCardTrigger>
							<InfoCircledIcon />
						</HoverCardTrigger>
						<HoverCardContent className="border-dashed">
							<div className="grid grid-cols-2 space-y-2">
								<h4 className="text-md col-span-2 font-semibold">{title}</h4>
								<Separator className="col-span-2" />
								<Link2Icon />
								<p>{sourceUrl}</p>
								<Separator className="col-span-2" />
								<CalendarIcon />
								<p className="text-sm text-gray-500">April 16, 2022</p>
							</div>
						</HoverCardContent>
					</HoverCard>

					<Button variant="ghost">
						<a href={sourceUrl}>
							<EnterFullScreenIcon />
						</a>
					</Button>
				</div>
			</CardFooter>
		</Card>
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
