import { agentsRouter } from "@/app/(dashboard)/agents/server/procedure";
import { meetingsRouter } from "@/app/(dashboard)/meetings/server/procedure";
import { premiumRouter } from "@/app/(dashboard)/upgrade/server/procedure";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	agents: agentsRouter,
	meetings: meetingsRouter,
	premium: premiumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
