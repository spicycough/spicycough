import * as React from "react";

import { cn } from "@/lib/utils";

export interface HeadingProps extends React.InputHTMLAttributes<HTMLHeadingElement> {}

const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, type, ...props }, ref) => {
		return (
			<h1
				className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, type, ...props }, ref) => {
		return (
			<h2
				className={cn(
					"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, type, ...props }, ref) => {
		return (
			<h3
				className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
H3.displayName = "H3";

const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, type, ...props }, ref) => {
		return (
			<h4
				className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
H4.displayName = "H4";

const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, type, ...props }, ref) => {
		return (
			<h5 className={cn("scroll-m-20 text-xl tracking-tight", className)} ref={ref} {...props} />
		);
	},
);
H5.displayName = "H5";

const H6 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, type, ...props }, ref) => {
		return (
			<h6
				className={cn("scroll-m-20 text-xl font-light tracking-tight", className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
H6.displayName = "H6";

export { H1, H2, H3, H4, H5, H6 };
