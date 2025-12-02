"use client";

import { Bell, Search, Check } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/actions/notification.action";
import { formatDistanceToNow } from "date-fns";


export function Header() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadNotifications();
        loadUser();
    }, []);

    const loadNotifications = async () => {
        const result = await getNotifications(10);
        if (result.success) {
            setNotifications(result.data);
        }

        const countResult = await getUnreadCount();
        if (countResult.success) {
            setUnreadCount(countResult.data.count);
        }
    };

    const loadUser = async () => {
        const session = await authClient.getSession();
        if (session.data?.user) {
            setUser(session.data.user);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        await markAsRead(notificationId);
        loadNotifications();
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
        loadNotifications();
        toast.success("All notifications marked as read");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 px-6 shadow-sm">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search documents..."
                        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-xl transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-red-600 text-white border-2 border-white dark:border-gray-900 shadow-lg">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-96 shadow-xl border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between px-2 py-2">
                            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    className="h-auto p-1 text-xs text-blue-600 hover:text-blue-700"
                                >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark all read
                                </Button>
                            )}
                        </div>
                        <DropdownMenuSeparator />
                        {notifications.length > 0 ? (
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.notification_id}
                                        className={cn(
                                            "flex flex-col items-start gap-1 p-3 cursor-pointer",
                                            !notification.read && "bg-blue-50 dark:bg-blue-950/20"
                                        )}
                                        onClick={() => {
                                            if (!notification.read) {
                                                handleMarkAsRead(notification.notification_id);
                                            }
                                            if (notification.link) {
                                                router.push(notification.link);
                                            }
                                        }}
                                    >
                                        <div className="flex items-start justify-between w-full">
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        {notification.message && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-sm text-gray-500">
                                No notifications
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 gap-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                            <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold">
                                    {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-sm font-medium">
                                    {user?.name ? user.name.split(' ').slice(0, 2).join(' ') : 'User'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.name || 'User'}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 shadow-xl border-gray-200 dark:border-gray-700">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings?tab=profile" className="cursor-pointer">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings?tab=security" className="cursor-pointer">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings?tab=activity" className="cursor-pointer">Activity Log</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            toast.success("Logged out successfully");
                                            router.push("/auth/login");
                                        },
                                    },
                                });
                            }}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
