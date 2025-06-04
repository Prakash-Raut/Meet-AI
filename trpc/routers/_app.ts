import { agentsRouter } from "@/app/(dashboard)/agents/server/procedure";
import { meetingsRouter } from "@/app/(dashboard)/meetings/server/procedure";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	agents: agentsRouter,
	meetings: meetingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
