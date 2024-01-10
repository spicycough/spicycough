import { Server } from "@/hooks/useServer";
import { ActionsBar } from "./_components/ActionsBar";
import { DetailsView } from "./_components/DetailsView";
import { Queue } from "./_components/Staging/Table";

import type { ContentItem } from "@/db/schema";
import { useState } from "react";

export const ContentItemPage = () => {
	const [selected, setSelected] = useState<ContentItem | null>(null);
	return (
		<Server>
			<main className="container flex flex-grow py-4">
				<div className="flex flex-auto flex-col justify-between rounded-lg border border-gray-800 border-opacity-50 bg-gradient-to-b from-twilight-800 to-twilight-900 p-4 pt-4">
					<DetailsView selected={selected} className="" />
					<div className="flex-none space-y-4">
						<Queue selected={selected} setSelected={setSelected} className="border" />
						<ActionsBar />
					</div>
				</div>
			</main>
		</Server>
	);
};
