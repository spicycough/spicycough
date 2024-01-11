import * as React from "react";

import { cn } from "@/lib/utils";

export interface MutedProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Muted = React.forwardRef<HTMLParagraphElement, MutedProps>(({ className, ...props }, ref) => {
	return <p className={cn("text-sm text-muted-foreground", className)} ref={ref} {...props} />;
});
Muted.displayName = "Muted";

export { Muted };
