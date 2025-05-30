import {
	CommandDialog,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import type { Dispatch, SetStateAction } from "react";

type DashboardCommandProps = {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Find a meeting or agent..." />
			<CommandList>
				<CommandItem>Test</CommandItem>
			</CommandList>
		</CommandDialog>
	);
};
