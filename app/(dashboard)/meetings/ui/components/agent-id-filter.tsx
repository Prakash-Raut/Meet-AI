"use client";

import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";

export const AgentIdFilter = () => {
	const trpc = useTRPC();
	const [filters, setFilters] = useMeetingsFilter();
	const [agentSearch, setAgentSearch] = useState("");

	const { data } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 100,
			search: agentSearch,
		}),
	);

	return (
		<CommandSelect
			className="h-9"
			placeholder="Agent"
			options={(data?.items ?? []).map((agent) => ({
				id: agent.id,
				value: agent.id,
				children: (
					<div className="flex items-center gap-x-2">
						<GeneratedAvatar
							seed={agent.name}
							variant="botttsNeutral"
							className="size-4"
						/>
						<p>{agent.name}</p>
					</div>
				),
			}))}
			onSelect={(value) =>
				setFilters({
					agentId: value,
				})
			}
			onSearch={setAgentSearch}
			value={filters.agentId}
		/>
	);
};
