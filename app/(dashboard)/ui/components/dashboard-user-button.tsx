"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { ChevronDown, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {
	const router = useRouter();
	const isMobile = useIsMobile();
	const { data, isPending } = authClient.useSession();

	const onLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => router.push("/sign-in"),
			},
		});
	};

	if (isPending || !data?.user) {
		return null;
	}

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger
					className="rounded-lg border border-border/10 p-3 w-full flex 
			items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2"
				>
					{data.user.image ? (
						<Avatar>
							<AvatarImage src={data.user.image} alt={data.user.name} />
						</Avatar>
					) : (
						<GeneratedAvatar
							seed={data.user.name}
							variant="initials"
							className="size-9 mr-3"
						/>
					)}
					<div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
						<p className="truncate text-sm font-medium text-white">
							{data.user.name}
						</p>
						<p className="truncate text-xs text-white/60">{data.user.email}</p>
					</div>
					<ChevronDown className="size-4 shrink-0 text-muted-foreground" />
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{data.user.name}</DrawerTitle>
						<DrawerDescription>{data.user.email}</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<Button
							variant="outline"
							onClick={() => authClient.customer.portal()}
						>
							Billing
							<CreditCardIcon className="size-4 text-black" />
						</Button>
						<Button variant="outline" onClick={onLogout}>
							Logout
							<LogOutIcon className="size-4 text-black" />
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="rounded-lg border border-border/10 p-3 w-full flex 
			items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2"
			>
				{data.user.image ? (
					<Avatar>
						<AvatarImage src={data.user.image} alt={data.user.name} />
					</Avatar>
				) : (
					<GeneratedAvatar
						seed={data.user.name}
						variant="initials"
						className="size-9 mr-3"
					/>
				)}
				<div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
					<p className="truncate text-sm font-medium text-white">
						{data.user.name}
					</p>
					<p className="truncate text-xs text-white/60">{data.user.email}</p>
				</div>
				<ChevronDown className="size-4 shrink-0 text-muted-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" side="right" className="w-72">
				<DropdownMenuLabel>
					<div className="flex flex-col gap-1">
						<p className="text-sm font-medium text-foreground truncate">
							{data.user.name}
						</p>
						<p className="text-xs font-normal text-muted-foreground truncate">
							{data.user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer flex items-center justify-between"
					onClick={() => authClient.customer.portal()}
				>
					Billing
					<CreditCardIcon className="size-4" />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer flex items-center justify-between"
					onClick={onLogout}
				>
					Logout
					<LogOutIcon className="size-4" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
