"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandResponsiveDialog,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "./ui/button";

interface Props {
	options: Array<{
		id: string;
		value: string;
		children?: ReactNode;
	}>;
	onSelect: (value: string) => void;
	onSearch?: (value: string) => void;
	value: string;
	placeholder?: string;
	isSearchable?: boolean;
	className?: string;
}

export const CommandSelect = ({
	options,
	onSelect,
	onSearch,
	value,
	placeholder = "Select an option",
	isSearchable,
	className,
}: Props) => {
	const [open, setOpen] = useState(false);
	const selectedOption = options.find((option) => option.value === value);

	const handleOpenChange = (open: boolean) => {
		onSearch?.("");
		setOpen(open);
	};

	return (
		<>
			<Button
				type="button"
				variant="outline"
				onClick={() => setOpen(true)}
				className={cn(
					"h-9 justify-between font-normal px-2",
					!selectedOption && "text-muted-foreground",
					className,
				)}
			>
				<div>{selectedOption?.children ?? placeholder}</div>
				<ChevronsUpDownIcon />
			</Button>
			<CommandResponsiveDialog
				shouldFilter={!onSearch}
				open={open}
				onOpenChange={handleOpenChange}
			>
				<Command>
					<CommandInput placeholder="Search..." onValueChange={onSearch} />
					<CommandEmpty>
						<span className="text-sm text-muted-foreground">
							No options found.
						</span>
					</CommandEmpty>
					<CommandGroup>
						{options.map((option) => (
							<CommandItem
								key={option.id}
								onSelect={() => onSelect(option.value)}
							>
								{option.children}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</CommandResponsiveDialog>
		</>
	);
};
