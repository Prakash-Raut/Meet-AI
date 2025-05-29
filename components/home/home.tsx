"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	if (!session) {
		return <p>Loading...</p>;
	}

	return (
		<main className="flex flex-col items-center justify-center h-screen p-4 gap-4">
			<p>Logged in as {session.user.name}</p>
			<Button
				onClick={() =>
					authClient.signOut({
						fetchOptions: {
							onSuccess: () => router.push("/sign-in"),
						},
					})
				}
			>
				Sign out
			</Button>
		</main>
	);
}
