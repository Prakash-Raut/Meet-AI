"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";

interface Props {
	meetingId: string;
}

export function MeetingIdView({ meetingId }: Props) {
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

	const { data } = useSuspenseQuery(
		trpc.meetings.getOne.queryOptions({ id: meetingId }),
	);

	const removeMeeting = useMutation(
		trpc.meetings.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);
				router.push("/meetings");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
		"Are you sure?",
		"The folowing action will remove this meeting.",
	);

	const handleRemoveMeeting = async () => {
		const ok = await confirmRemove();
		if (!ok) return;
		removeMeeting.mutate({ id: meetingId });
	};

	return (
		<>
			<RemoveConfirmationDialog />
			<UpdateMeetingDialog
				open={updateMeetingDialogOpen}
				onOpenChange={setUpdateMeetingDialogOpen}
				initialValues={data}
			/>
			<div className="flex-1 p-4 md:px-8 flex flex-col gap-y-4">
				<MeetingIdViewHeader
					meetingId={meetingId}
					meetingName={data.name}
					onEdit={() => setUpdateMeetingDialogOpen(true)}
					onRemove={handleRemoveMeeting}
				/>
			</div>
		</>
	);
}

export const MeetingIdViewLoader = () => {
	return (
		<LoadingState
			title="Loading meetings"
			description="This may take a few seconds"
		/>
	);
};

export const MeetingIdViewError = () => {
	return (
		<ErrorState
			title="Error loading meetings"
			description="Please try again later"
		/>
	);
};
