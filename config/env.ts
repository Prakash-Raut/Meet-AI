import "dotenv/config";

export const Config = {
	DATABASE_URL: process.env.DATABASE_URL || "",
};
