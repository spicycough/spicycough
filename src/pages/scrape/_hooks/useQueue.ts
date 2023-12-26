import { useContext } from "react";
import { QueueContext, type UseQueue } from "./QueueContext";

export const useQueue = (): UseQueue => {
	const context = useContext(QueueContext);
	if (context === undefined) {
		throw new Error("useQueue must be used within a QueueProvider");
	}

	return context;
};
