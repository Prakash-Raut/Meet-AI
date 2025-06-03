"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/lib/constants";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { AgentSearchFilter } from "./agent-search-filter";
import { NewAgentDialog } from "./new-agent-dialog";

const AgentsListHeader = () => {
	const [filters, setFilters] = useAgentsFilter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const isAnyFilterModified = !!filters.search;

	const onClearFilter = () => {
		setFilters({ search: "", page: DEFAULT_PAGE });
	};

	return (
		<>
			<NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
			<div className="p-4 md:px-8 flex flex-col gap-y-4">
				<div className="flex items-center justify-between">
					<h5 className="text-xl font-medium">Agents</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon />
						Add Agent
					</Button>
				</div>
				<div className="flex items-center gap-x-2 p-1">
					<AgentSearchFilter />
					{isAnyFilterModified && (
						<Button variant="outline" size="sm" onClick={onClearFilter}>
							<XCircleIcon />
						</Button>
					)}
				</div>
			</div>
		</>
	);
};

export default AgentsListHeader;
