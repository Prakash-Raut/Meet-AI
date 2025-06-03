"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import type { AgentGetOne } from "../../lib/types";
import { AgentForm } from "./agent-form";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialValues: AgentGetOne;
}

export const UpdateAgentDialog = ({
	open,
	onOpenChange,
	initialValues,
}: Props) => {
	return (
		<ResponsiveDialog
			title="Edit Agent"
			description="Edit the agent details"
			open={open}
			onOpenChange={onOpenChange}
		>
			<AgentForm
				onSuccess={() => {
					onOpenChange(false);
				}}
				onCancel={() => {
					onOpenChange(false);
				}}
				initialValues={initialValues}
			/>
		</ResponsiveDialog>
	);
};
