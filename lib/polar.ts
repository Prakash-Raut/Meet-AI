import { Config } from "@/config/env";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
	accessToken: Config.POLAR_ACCESS_TOKEN,
});
