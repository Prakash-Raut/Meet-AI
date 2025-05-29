import { Config } from "@/config/env";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(Config.DATABASE_URL);
