import { loadSearchParams } from "@/app/(dashboard)/agents/lib/params";
import AgentsListHeader from "@/app/(dashboard)/agents/ui/components/agents-list-header";
import {
	AgentView,
	AgentViewError,
	AgentViewLoader,
} from "@/app/(dashboard)/agents/ui/views/agent-view";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AgentsPageProps {
	searchParams: Promise<SearchParams>;
}

const AgentsPage = async ({ searchParams }: AgentsPageProps) => {
	const filters = await loadSearchParams(searchParams);
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.agents.getMany.queryOptions({ ...filters }),
	);

	return (
		<>
			<AgentsListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<AgentViewLoader />}>
					<ErrorBoundary fallback={<AgentViewError />}>
						<AgentView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
};

export default AgentsPage;
