import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { Config } from "./config/env";

export default defineConfig({
	out: "./drizzle",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: Config.DATABASE_URL,
	},
});
