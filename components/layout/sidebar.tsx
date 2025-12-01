"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileText,
    Search,
    Upload,
    FolderOpen,
    LayoutDashboard,
    Settings,
    Users,
    FileBarChart,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Documents", href: "/documents", icon: FileText },
    { name: "Upload", href: "/documents/upload", icon: Upload },
    { name: "Search", href: "/search", icon: Search },
    { name: "Categories", href: "/categories", icon: FolderOpen },
    { name: "Reports", href: "/reports", icon: FileBarChart },
    { name: "Users", href: "/users", icon: Users, adminOnly: true },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar transition-transform">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">DocuVault</h1>
                            <p className="text-xs text-muted-foreground">Ministry of Finance</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-border p-4 space-y-4">
                    <div className="rounded-lg bg-accent/50 p-3">
                        <p className="text-xs font-medium text-accent-foreground">Storage Used</p>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/50">
                            <div className="h-full w-[65%] rounded-full bg-gradient-to-br from-primary to-primary/80" />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">2.4 GB of 4 GB</p>
                    </div>

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
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0 " />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
