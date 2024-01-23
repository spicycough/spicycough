import { Slot, type SlotProps } from "@radix-ui/react-slot";
import * as React from "react";
import { match } from "ts-pattern";

import { cn } from "@/lib/utils";

export interface EditableTextAsProps extends React.HTMLAttributes<HTMLElement> {}

export interface EditableTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
	as?:
		| React.ForwardRefExoticComponent<EditableTextAsProps & React.RefAttributes<HTMLElement>>
		| JSX.IntrinsicElements["p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"]
		| "p"
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6";
}

const EditableText = React.forwardRef<HTMLInputElement, EditableTextProps>(
	({ as, className, type, defaultValue, onBlur, onChange, ...props }, ref) => {
		const [isEditing, setIsEditing] = React.useState(false);
		const [text, setText] = React.useState(defaultValue);

		const Comp = as ? Slot : "p";

		const updateText = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);

		const startEditing = () => setIsEditing(true);
		const stopEditing = () => setIsEditing(false);

		return isEditing ? (
			<input
				type="text"
				value={text}
				className={cn(
					"flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
					className,
				)}
				ref={ref}
				onChange={(event) => {
					updateText(event);
					if (onChange) {
						onChange(event);
					}
				}}
				onBlur={(event) => {
					stopEditing();
					if (onBlur) {
						onBlur(event);
					}
				}}
				onKeyUp={(event) => {
					match(event.key)
						.with("Enter", () => {
							setText(props.value);
						})
						.with("Escape", () => {
							setIsEditing(false);
						}).exhaustive;
				}}
				{...props}
			/>
		) : (
			<Comp
				onClick={startEditing}
				className="underline-offset-4 hover:text-accent-foreground hover:underline"
			>
				{text}
			</Comp>
		);
	},
);
EditableText.displayName = "EditableText";

export { EditableText };
