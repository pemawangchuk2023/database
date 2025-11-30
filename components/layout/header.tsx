"use client";

import { Bell, Search } from "lucide-react";
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

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search documents..."
                        className="pl-10 bg-muted/50 border-border/50 focus-visible:ring-primary"
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
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                                3
                            </Badge>
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                            <p className="text-sm font-medium">New document uploaded</p>
                            <p className="text-xs text-muted-foreground">Q4 2024 Financial Report was uploaded</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                            <p className="text-sm font-medium">Document updated</p>
                            <p className="text-xs text-muted-foreground">Budget Allocation 2025 has been updated</p>
                            <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                            <p className="text-sm font-medium">New circular published</p>
                            <p className="text-xs text-muted-foreground">Remote Work Policy Circular is now available</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 gap-2 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">AU</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-sm font-medium">Admin User</span>
                                <span className="text-xs text-muted-foreground">Administrator</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Activity Log</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
