import * as React from "react";

import { cn } from "@/lib/utils";

export interface UnorderedListProps extends React.HTMLAttributes<HTMLUListElement> {}

const Ul = React.forwardRef<HTMLUListElement, UnorderedListProps>(
	({ className, ...props }, ref) => {
		return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} ref={ref} {...props} />;
	},
);
Ul.displayName = "Ul";

export interface OrderedListProps extends React.HTMLAttributes<HTMLOListElement> {}

const Ol = React.forwardRef<HTMLOListElement, OrderedListProps>(({ className, ...props }, ref) => {
	return <ol className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} ref={ref} {...props} />;
});
Ol.displayName = "Ol";

export { Ul, Ol };
