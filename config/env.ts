import "dotenv/config";

export const Config = {
	DATABASE_URL: process.env.DATABASE_URL || "",
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "",
};
