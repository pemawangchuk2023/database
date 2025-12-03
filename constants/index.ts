// Application Constants
import {
	FileText,
	Search,
	Upload,
	FolderOpen,
	LayoutDashboard,
	Settings,
	Users,
	FileBarChart,
} from "lucide-react";

// Role Constants
export const ROLES = {
	ADMIN: "admin",
	STAFF: "staff",
} as const;

// Document Status Constants
export const DOCUMENT_STATUS = {
	DRAFT: "draft",
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
} as const;

// Access Level Constants
export const ACCESS_LEVELS = {
	PUBLIC: "public",
	INTERNAL: "internal",
	CONFIDENTIAL: "confidential",
} as const;

// Sidebar Navigation Links
export const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "All Documents", href: "/documents", icon: FileText },
	{ name: "Upload", href: "/documents/upload", icon: Upload },
	{ name: "Search", href: "/search", icon: Search },
	{ name: "Categories", href: "/categories", icon: FolderOpen },
	{ name: "Reports", href: "/reports", icon: FileBarChart },
	{ name: "Users", href: "/users", icon: Users, adminOnly: true },
	{ name: "Settings", href: "/settings", icon: Settings },
];
