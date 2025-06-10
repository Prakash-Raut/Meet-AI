import { Config } from "@/config/env";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { polarClient } from "./polar";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: Config.GOOGLE_CLIENT_ID,
			clientSecret: Config.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: Config.GITHUB_CLIENT_ID,
			clientSecret: Config.GITHUB_CLIENT_SECRET,
		},
	},
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					successUrl: process.env.POLAR_SUCCESS_URL,
					authenticatedUsersOnly: true,
				}),
				portal(),
			],
		}),
	],
});
