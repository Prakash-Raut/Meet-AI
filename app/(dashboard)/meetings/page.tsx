import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "./lib/params";
import { MeetingsListHeader } from "./ui/components/meetings-list-header";
import {
	MeetingsView,
	MeetingsViewError,
	MeetingsViewLoader,
} from "./ui/views/meetings-view";

interface Props {
	searchParams: Promise<SearchParams>;
}

export default async function MeetingsPage({ searchParams }: Props) {
	const filters = await loadSearchParams(searchParams);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	);

	return (
		<>
			<MeetingsListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingsViewLoader />}>
					<ErrorBoundary fallback={<MeetingsViewError />}>
						<MeetingsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
}
