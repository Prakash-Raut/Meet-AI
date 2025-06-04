"use client";

import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { columns } from "../components/columns";

export const MeetingsView = () => {
	const trpc = useTRPC();
	const [filters, setFilters] = useMeetingsFilter();
	const router = useRouter();
	const { data } = useSuspenseQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	);

	return (
		<div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
			<DataTable
				columns={columns}
				data={data.items}
				onRowClick={(row) => router.push(`/meetings/${row.id}`)}
			/>
			<DataTablePagination
				page={filters.page}
				totalPages={data.totalPages}
				onPageChange={(page) => setFilters({ page })}
			/>
			{data.items.length === 0 && (
				<EmptyState
					title="Create your first meeting"
					description="Schedule a meeting to connect with others.
					Each Meeting lets you colloborate, share ideas, and interact
					with participants in real time."
				/>
			)}
		</div>
	);
};

export const MeetingsViewLoader = () => {
	return (
		<LoadingState
			title="Loading meetings"
			description="This may take a few seconds"
		/>
	);
};

export const MeetingsViewError = () => {
	return (
		<ErrorState
			title="Error loading meetings"
			description="Please try again later"
		/>
	);
};
