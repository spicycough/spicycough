import { Server } from "@/hooks/useServer";
import { EmptyQueue } from "./_components/EmptyQueue";

export const NewContentItemPage = () => {
	return (
		<Server>
			<main className="container flex flex-grow py-4">
				<EmptyQueue />
			</main>
		</Server>
	);
};
