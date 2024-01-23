import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
