import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsListHeader } from "../ui/components/meetings-list-header";
import {
	MeetingIdView,
	MeetingIdViewError,
	MeetingIdViewLoader,
} from "../ui/views/meeting-id-view";

interface Props {
	params: Promise<{ meetingId: string }>;
}

const MeetingPage = async ({ params }: Props) => {
	const { meetingId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.meetings.getOne.queryOptions({
			id: meetingId,
		}),
	);

	return (
		<>
			<MeetingsListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingIdViewLoader />}>
					<ErrorBoundary fallback={<MeetingIdViewError />}>
						<MeetingIdView meetingId={meetingId} />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
};

export default MeetingPage;
