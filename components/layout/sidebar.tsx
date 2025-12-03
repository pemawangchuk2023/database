"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-provider";
import { navigation } from "@/constants";

const Sidebar = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { collapsed, setCollapsed } = useSidebar();

	return (
		<TooltipProvider delayDuration={0}>
			<aside
				className={cn(
					"fixed left-0 top-0 z-40 h-screen border-r bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out shadow-xl",
					collapsed ? "w-16" : "w-64"
				)}
			>
				<div className='flex h-full flex-col'>
					{/* Logo */}
					<div className='flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-4 justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900'>
						{!collapsed && (
							<Link href='/dashboard' className='flex items-center gap-3 group'>
								<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl'>
									<FileText className='h-5 w-5 text-white' />
								</div>
								<div>
									<h1 className='text-base font-bold text-gray-900 dark:text-white'>
										DocuVault
									</h1>
									<p className='text-[18px] text-gray-600 dark:text-gray-400'>
										Ministry of Finance
									</p>
								</div>
							</Link>
						)}
						{collapsed && (
							<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mx-auto'>
								<FileText className='h-5 w-5 text-white' />
							</div>
						)}
					</div>

					{/* Toggle Button */}
					<div className='border-b border-gray-200 dark:border-gray-800 px-2 py-3 bg-gray-50 dark:bg-gray-800/50'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setCollapsed(!collapsed)}
							className={cn(
								"w-full justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all",
								!collapsed && "justify-end"
							)}
						>
							{collapsed ? (
								<ChevronRight className='h-4 w-4' />
							) : (
								<ChevronLeft className='h-4 w-4' />
							)}
						</Button>
					</div>

					{/* Navigation */}
					<nav className='flex-1 space-y-1 overflow-y-auto px-3 py-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900'>
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							const Icon = item.icon;

							const linkContent = (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
										isActive
											? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
											: "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-102",
										collapsed && "justify-center px-2"
									)}
								>
									<Icon
										className={cn(
											"h-5 w-5 flex-shrink-0",
											isActive && "drop-shadow-sm"
										)}
									/>
									{!collapsed && <span>{item.name}</span>}
									{isActive && !collapsed && (
										<div className='ml-auto h-2 w-2 rounded-full bg-white shadow-sm' />
									)}
								</Link>
							);

							if (collapsed) {
								return (
									<Tooltip key={item.name}>
										<TooltipTrigger asChild>{linkContent}</TooltipTrigger>
										<TooltipContent
											side='right'
											className='font-medium bg-gray-900 dark:bg-gray-800 text-white border-gray-700'
										>
											{item.name}
										</TooltipContent>
									</Tooltip>
								);
							}

							return linkContent;
						})}
					</nav>

					{/* Footer */}
					<div className='border-t border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-800/50'>
						{collapsed ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={async () => {
											await authClient.signOut({
												fetchOptions: {
													onSuccess: () => {
														router.push("/auth/login");
													},
												},
											});
										}}
										className='flex w-full items-center justify-center rounded-xl px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105'
									>
										<LogOut className='h-5 w-5' />
									</Button>
								</TooltipTrigger>
								<TooltipContent
									side='right'
									className='font-medium bg-gray-900 dark:bg-gray-800 text-white border-gray-700'
								>
									Log Out
								</TooltipContent>
							</Tooltip>
						) : (
							<button
								onClick={async () => {
									await authClient.signOut({
										fetchOptions: {
											onSuccess: () => {
												router.push("/auth/login");
											},
										},
									});
								}}
								className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105'
							>
								<LogOut className='h-5 w-5 flex-shrink-0' />
								<span>Log Out</span>
							</button>
						)}
					</div>
				</div>
			</aside>
		</TooltipProvider>
	);
};

export default Sidebar;
