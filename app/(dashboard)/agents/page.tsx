import {
	AgentView,
	AgentViewError,
	AgentViewLoader,
} from "@/components/agents/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const AgentsPage = async () => {
	const queryClient = getQueryClient();

	try {
		await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
	} catch (error) {
		// Optionally log to Sentry
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<AgentViewLoader />}>
				<ErrorBoundary fallback={<AgentViewError />}>
					<AgentView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default AgentsPage;
