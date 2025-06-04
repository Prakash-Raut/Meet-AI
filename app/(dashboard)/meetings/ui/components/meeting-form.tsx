"use client";

import { NewAgentDialog } from "@/app/(dashboard)/agents/ui/components/new-agent-dialog";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { meetingInsertSchema } from "../../lib/schema";
import type { MeetingGetOne } from "../../lib/types";

interface Props {
	onSuccess?: (id?: string) => void;
	onCancel?: () => void;
	initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues }: Props) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
	const [agentSearch, setAgentSearch] = useState("");

	const agents = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 100,
			search: agentSearch,
		}),
	);

	const createMeeting = useMutation(
		trpc.meetings.create.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);

				onSuccess?.(data.id);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const updateMeeting = useMutation(
		trpc.meetings.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({}),
				);

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.meetings.getOne.queryOptions({
							id: initialValues.id,
						}),
					);
				}

				onSuccess?.();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		}),
	);

	const form = useForm<z.infer<typeof meetingInsertSchema>>({
		resolver: zodResolver(meetingInsertSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			agentId: initialValues?.agentId ?? "",
		},
	});

	const isEdit = !!initialValues;
	const isPending = createMeeting.isPending || updateMeeting.isPending;

	const onSubmit = (values: z.infer<typeof meetingInsertSchema>) => {
		if (isEdit) {
			updateMeeting.mutate({
				...values,
				id: initialValues?.id,
			});
		} else {
			createMeeting.mutate(values);
		}
	};

	return (
		<>
			<NewAgentDialog
				open={openNewAgentDialog}
				onOpenChange={setOpenNewAgentDialog}
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} placeholder="e.g. Math Consultation" />
								</FormControl>
								<FormMessage />
								<FormDescription>
									This is the name of the meeting.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="agentId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Agent</FormLabel>
								<FormControl>
									<CommandSelect
										options={(agents.data?.items ?? []).map((agent) => ({
											id: agent.id,
											value: agent.name,
											children: (
												<div className="flex items-center gap-x-2">
													<GeneratedAvatar
														seed={agent.name}
														variant="botttsNeutral"
														className="border size-6"
													/>
													<span className="text-sm font-medium">
														{agent.name}
													</span>
												</div>
											),
										}))}
										onSelect={field.onChange}
										onSearch={setAgentSearch}
										value={field.value}
										placeholder="Select an agent"
									/>
								</FormControl>
								<FormMessage />
								<FormDescription>
									Not found what you&apos;re looking for?
									<button
										type="button"
										className="text-primary hover:underline px-2"
										onClick={() => setOpenNewAgentDialog(true)}
									>
										Create a new agent
									</button>
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-center justify-between gap-x-2">
						{onCancel && (
							<Button
								type="button"
								variant="ghost"
								disabled={isPending}
								onClick={onCancel}
							>
								Cancel
							</Button>
						)}
						<Button type="submit" disabled={isPending}>
							{isEdit ? "Update" : "Create"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
