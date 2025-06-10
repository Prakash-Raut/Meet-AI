"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateAvatarUri } from "@/lib/avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import Highlighter from "react-highlight-words";

interface Props {
	meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
	const trpc = useTRPC();

	const { data } = useQuery(
		trpc.meetings.getTranscript.queryOptions({
			id: meetingId,
		}),
	);

	const [searchQuery, setSearchQuery] = useState("");

	const filteredTranscript = (data ?? [])?.filter((item) =>
		item.text.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
			<p className="text-sm font-medium">Transcript</p>
			<div className="relative">
				<Input
					placeholder="Search transcript"
					className="pl-7 h-9 w-[240px]"
					value={searchQuery}
					onChange={handleSearch}
				/>
				<SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
			</div>
			<ScrollArea>
				{filteredTranscript.map((item) => {
					return (
						<div
							key={item.start_ts}
							className="flex flex-col gap-y-2 hover:bg-muted/50 p-4 rounded-md border"
						>
							<div className="flex items-center gap-x-2">
								<Avatar className="size-6">
									<AvatarImage
										src={
											item.user.image ??
											generateAvatarUri({
												seed: item.user.name,
												variant: "initials",
											})
										}
										alt={item.user.name}
									/>
								</Avatar>
								<p className="text-sm font-medium">{item.user.name}</p>
								<p className="text-sm text-blue-500 font-medium">
									{format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss")}
								</p>
							</div>
							<Highlighter
								className="text-sm text-neutral-700"
								highlightClassName="bg-yellow-200"
								searchWords={[searchQuery]}
								textToHighlight={item.text}
								autoEscape={true}
							/>
						</div>
					);
				})}
			</ScrollArea>
		</div>
	);
};
