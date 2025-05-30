import { SidebarProvider } from "@/components/ui/sidebar";
import type { ChildrenProps } from "@/types";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardLayout({ children }: ChildrenProps) {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<main className="flex flex-col h-screen w-screen bg-muted">
				<DashboardNavbar />
				{children}
			</main>
		</SidebarProvider>
	);
}
