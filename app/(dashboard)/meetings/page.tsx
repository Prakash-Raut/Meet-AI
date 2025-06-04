import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	MeetingView,
	MeetingViewError,
	MeetingViewLoader,
} from "./ui/views/meeting-view";

export default function MeetingsPage() {
	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

	return (
		<>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingViewLoader />}>
					<ErrorBoundary fallback={<MeetingViewError />}>
						<MeetingView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
}
