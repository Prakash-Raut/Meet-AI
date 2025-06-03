"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorState } from "../../../../components/error-state";
import { LoadingState } from "../../../../components/loading-state";

export const AgentView = () => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

	return <div>{JSON.stringify(data, null, 2)}</div>;
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
