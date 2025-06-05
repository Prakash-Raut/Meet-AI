import { botttsNeutral, initials } from "@dicebear/collection";
import type { Result } from "@dicebear/core";
import { createAvatar } from "@dicebear/core";

interface Props {
	seed: string;
	variant?: "botttsNeutral" | "initials";
}

export const generateAvatarUri = ({ seed, variant }: Props) => {
	let avatar: Result;

	if (variant === "initials") {
		avatar = createAvatar(initials, {
			seed,
			fontWeight: 500,
			fontSize: 42,
		});
	} else {
		avatar = createAvatar(botttsNeutral, {
			seed,
		});
	}

	return avatar.toDataUri();
};
