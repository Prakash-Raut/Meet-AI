import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsListHeader } from "./ui/components/meetings-list-header";
import {
	MeetingsView,
	MeetingsViewError,
	MeetingsViewLoader,
} from "./ui/views/meetings-view";

export default async function MeetingsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

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
