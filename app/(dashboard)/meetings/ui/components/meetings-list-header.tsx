"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { MeetingSearchFilter } from "./meeting-search-filter";
import { MeetingStatusFilter } from "./meeting-status-filter";
import { NewMeetingDialog } from "./new-meeting-dialog";

export const MeetingsListHeader = () => {
	const [filters, setFilters] = useMeetingsFilter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const isAnyFilterModified =
		!!filters.status || !!filters.search || !!filters.agentId;

	const onClearFilters = () => {
		setFilters({
			status: null,
			search: "",
			agentId: "",
			page: 1,
		});
	};

	return (
		<>
			<NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
			<div className="p-4 md:px-8 flex flex-col gap-y-4">
				<div className="flex items-center justify-between">
					<h5 className="text-xl font-medium">Meetings</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon />
						Add Meeting
					</Button>
				</div>
				<ScrollArea>
					<div className="flex items-center gap-x-2 p-1">
						<MeetingSearchFilter />
						<MeetingStatusFilter />
						<AgentIdFilter />
						{isAnyFilterModified && (
							<Button variant="outline" onClick={onClearFilters}>
								<XCircleIcon />
								Clear
							</Button>
						)}
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</>
	);
};
