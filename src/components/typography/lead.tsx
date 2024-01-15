import * as React from "react";

import { cn } from "@/lib/utils";

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(({ className, ...props }, ref) => {
	return <p className={cn("text-xl text-muted-foreground", className)} ref={ref} {...props} />;
});
Lead.displayName = "Lead";

export { Lead };
