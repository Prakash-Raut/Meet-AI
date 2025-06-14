"use client";

import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { columns } from "../components/columns";
import { DataTablePagination } from "../components/data-table-pagination";

export const AgentView = () => {
	const router = useRouter();
	const [filters, setFilters] = useAgentsFilter();
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.agents.getMany.queryOptions({ ...filters }),
	);

	return (
		<div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
			<DataTable
				columns={columns}
				data={data.items}
				onRowClick={(row) => router.push(`/agents/${row.id}`)}
			/>
			<DataTablePagination
				page={filters.page}
				totalPages={data.totalPages}
				onPageChange={(page) => setFilters({ page })}
			/>
			{data.items.length === 0 && (
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
