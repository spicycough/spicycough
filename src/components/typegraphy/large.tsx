import * as React from "react";

import { cn } from "@/lib/utils";

export interface LargeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Large = React.forwardRef<HTMLDivElement, LargeProps>(({ className, ...props }, ref) => {
	return <div className={cn("text-lg font-semibold", className)} ref={ref} {...props} />;
});
Large.displayName = "Large";

export { Large };
