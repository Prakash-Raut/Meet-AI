"use client";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { agentInsertSchema } from "../../schema";
import type { AgentGetOne } from "../../types";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AgentFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	initialValues?: AgentGetOne;
}

export const AgentForm = ({
	onSuccess,
	onCancel,
	initialValues,
}: AgentFormProps) => {
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();

	const createAgent = useMutation(
		trpc.agents.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({}),
				);

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.agents.getOne.queryOptions({
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

	const form = useForm<z.infer<typeof agentInsertSchema>>({
		resolver: zodResolver(agentInsertSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			instructions: initialValues?.instructions ?? "",
		},
	});

	const isEdit = !!initialValues;
	const isPending = createAgent.isPending;

	const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
		if (isEdit) {
			console.log("TODO:update agent");
		} else {
			createAgent.mutate(values);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<GeneratedAvatar
					seed={form.watch("name")}
					variant="botttsNeutral"
					className="border size-16"
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="e.g. Math Tutor" {...field} />
							</FormControl>
							<FormMessage />
							<FormDescription>
								This is your agent's display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="instructions"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instructions</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="e.g. You are a helpful math assistant that 
                  can answer questions and help with assignments."
								/>
							</FormControl>
							<FormMessage />
							<FormDescription>
								This is your agent's instructions.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center gap-x-2">
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
	);
};
