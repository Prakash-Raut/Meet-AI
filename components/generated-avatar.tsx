import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { botttsNeutral, initials } from "@dicebear/collection";
import type { Result } from "@dicebear/core";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";

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
	const avatar: Result = useMemo(() => {
		if (variant === "botttsNeutral") {
			return createAvatar(botttsNeutral, { seed });
		}

		return createAvatar(initials, {
			seed,
			fontWeight: 500,
			fontSize: 42,
		});
	}, [seed, variant]);

	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatar.toDataUri()} alt="Avatar" />
			<AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	);
};
