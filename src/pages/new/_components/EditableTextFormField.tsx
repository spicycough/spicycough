import { H3 } from "@/components/typegraphy/h";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import {
	useFormContext,
	type Control,
	type ControllerFieldState,
	type ControllerRenderProps,
	type UseFormStateReturn,
} from "react-hook-form";
import { match } from "ts-pattern";

type RenderProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	field: ControllerRenderProps<any, string>;
	fieldState: ControllerFieldState;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	formState: UseFormStateReturn<any>;
};

type EditableTextFormFieldProps = React.PropsWithRef<{
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	defaultValue?: string;
	onPersist?: (field: RenderProps["field"]) => void;
	onAbort?: () => void;
}>;

export const EditableTextFormField = React.forwardRef<HTMLInputElement, EditableTextFormFieldProps>(
	({ name, defaultValue, onAbort }, ref) => {
		const { control, setFocus } = useFormContext();
		const [isEditing, setIsEditing] = React.useState(false);
		const [text, setText] = React.useState(defaultValue);

		const startEditing = () => setIsEditing(true);
		const stopEditing = () => setIsEditing(false);

		const handleOnKey: React.KeyboardEventHandler<HTMLElement> = (event) => {
			match(event.key)
				.with("Enter", () => {
					setText(text);
					stopEditing();
				})
				.with("Escape", () => {
					stopEditing();
					if (onAbort) onAbort();
				}).exhaustive;
		};

		// const updateText = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value);

		return (
			<FormField
				control={control}
				name={name}
				render={({ field }) => {
					return (
						<FormItem>
							<FormControl onBlur={stopEditing} onKeyUp={handleOnKey}>
								{isEditing ? (
									<Input
										ref={ref}
										onBlur={stopEditing}
										onChange={() => setText(field.value)}
										value={text}
										className="invalid:border-red-300"
									/>
								) : (
									<H3
										onClick={() => {
											startEditing();
											setFocus(name);
										}}
										className="cursor-pointer underline hover:text-fog-300"
									>
										{text}
									</H3>
								)}
							</FormControl>
							<FormMessage />
						</FormItem>
					);
				}}
			/>
		);
	},
);
