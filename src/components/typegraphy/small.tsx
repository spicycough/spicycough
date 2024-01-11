import * as React from "react";

import { cn } from "@/lib/utils";

export interface SmallProps extends React.HTMLAttributes<HTMLDivElement> {}

const Small = React.forwardRef<HTMLDivElement, SmallProps>(({ className, ...props }, ref) => {
	return <div className={cn("text-sm font-medium leading-none", className)} ref={ref} {...props} />;
});
Small.displayName = "Small";

export { Small };
