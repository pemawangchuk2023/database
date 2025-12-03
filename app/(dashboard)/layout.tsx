"use client";
import { Toaster } from "@/components/ui/sonner";
import {
	SidebarProvider,
	useSidebar,
} from "@/components/layout/sidebar-provider";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
	const { collapsed } = useSidebar();

	return (
		<div className='flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950'>
			<Sidebar />
			<div
				className={cn(
					"flex flex-1 flex-col overflow-hidden transition-all duration-300",
					collapsed ? "ml-16" : "ml-64"
				)}
			>
				<Header />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
			<Toaster />
		</div>
	);
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardContent>{children}</DashboardContent>
		</SidebarProvider>
	);
}
