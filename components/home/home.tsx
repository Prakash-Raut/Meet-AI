"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const trpc = useTRPC();
	const { data } = useQuery(trpc.hello.queryOptions({ text: "Prakash" }));

	return (
		<main className="flex flex-col p-4 gap-y-4">
			<p>{data?.greeting}</p>
		</main>
	);
}
