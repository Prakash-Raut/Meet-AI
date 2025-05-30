import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { botttsNeutral, initials } from "@dicebear/collection";
import type { Result } from "@dicebear/core";
import { createAvatar } from "@dicebear/core";

interface GeneratedAvatarProps {
	seed: string;
	className?: string;
	variant?: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
	seed,
	className,
	variant,
}: GeneratedAvatarProps) => {
	let avatar: Result;

	if (variant === "botttsNeutral") {
		avatar = createAvatar(botttsNeutral, {
			seed,
		});
	} else {
		avatar = createAvatar(initials, {
			seed,
			fontWeight: 500,
			fontSize: 42,
		});
	}

	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatar.toDataUri()} alt="Avatar" />
			<AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	);
};
