import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HomePage = () => {
	return <Featured />;
};

export const Featured = () => {
	return (
		<div>
			<ScrollArea>
				<Separator />
			</ScrollArea>
		</div>
	);
};
