import * as React from "react";

import { cn } from "@/lib/utils";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

const Code = React.forwardRef<HTMLElement, CodeProps>(({ className, ...props }, ref) => {
	return (
		<code
			className={cn(
				"relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});
Code.displayName = "InlineCode";

export { Code };
