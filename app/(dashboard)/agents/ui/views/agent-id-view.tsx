"use client";

import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
	agentId: string;
}

export function AgentIdView({ agentId }: Props) {
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

	const { data } = useSuspenseQuery(
		trpc.agents.getOne.queryOptions({ id: agentId }),
	);

	const removeAgent = useMutation(
		trpc.agents.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({}),
				);
				await queryClient.invalidateQueries(
					trpc.premium.getFreeUsage.queryOptions(),
				);
				router.push("/agents");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
		"Are you sure you want to remove this agent?",
		`The folowing action will remove ${data.meetingCount} associated meetings.`,
	);

	const handleRemoveAgent = async () => {
		const ok = await confirmRemove();
		if (!ok) return;
		removeAgent.mutate({ id: agentId });
	};

	return (
		<>
			<RemoveConfirmationDialog />
			<UpdateAgentDialog
				open={updateAgentDialogOpen}
				onOpenChange={setUpdateAgentDialogOpen}
				initialValues={data}
			/>
			<div className="flex-1 p-4 md:px-8 flex flex-col gap-y-4">
				<AgentIdViewHeader
					agentId={agentId}
					agentName={data.name}
					onEdit={() => setUpdateAgentDialogOpen(true)}
					onRemove={handleRemoveAgent}
				/>
				<div className="bg-white rounded-lg border">
					<div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
						<div className="flex items-center gap-x-3">
							<div className="flex items-center gap-x-2">
								<GeneratedAvatar
									seed={data.name}
									variant="botttsNeutral"
									className="size-10"
								/>
								<h2 className="text-2xl font-medium">{data.name}</h2>
							</div>
						</div>
						<Badge variant="outline" className="text-sm">
							<VideoIcon className="text-blue-700" />
							{data.meetingCount}{" "}
							{data.meetingCount === 1 ? "Meeting" : "Meetings"}
						</Badge>
						<div className="flex flex-col gap-y-4">
							<p className="text-lg font-medium">Instructions</p>
							<p className="text-neutral-800">{data.instructions}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export const AgentIdViewLoader = () => {
	return (
		<LoadingState
			title="Loading agents"
			description="This may take a few seconds"
		/>
	);
};

export const AgentIdViewError = () => {
	return (
		<ErrorState
			title="Error loading agents"
			description="Please try again later"
		/>
	);
};
