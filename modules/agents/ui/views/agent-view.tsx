"use client";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";

export const AgentView = () => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

	return (
		<div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
			<DataTable columns={columns} data={data} />
			{data.length === 0 && (
				<EmptyState
					title="Create your first agent"
					description="Create an agent to join you meetings. Each agent will
					follow your instructions and can interact with participants during call."
				/>
			)}
		</div>
	);
};

export const AgentViewLoader = () => {
	return (
		<LoadingState
			title="Loading agents"
			description="This may take a few seconds"
		/>
	);
};

export const AgentViewError = () => {
	return (
		<ErrorState
			title="Error loading agents"
			description="Please try again later"
		/>
	);
};
