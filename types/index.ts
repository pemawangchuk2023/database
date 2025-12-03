// Document Types
export interface Document {
	id: string;
	title: string;
	description: string;
	fileName: string;
	fileSize: number;
	fileType: string;
	filePath: string;
	documentType: DocumentType;
	category: string;
	tags: string[];
	uploadedBy: string;
	uploadedAt: Date;
	updatedAt: Date;
	status: "draft" | "published" | "archived";
	accessLevel: "public" | "internal" | "confidential";
	version: number;
}

export interface DocumentType {
	id: string;
	name: string;
	description: string;
	icon: string;
	color: string;
}

// Predefined Document Types
export const DocumentTypes: DocumentType[] = [
	{
		id: "budget",
		name: "Budget Document",
		description: "Financial budget and planning documents",
		icon: "DollarSign",
		color: "green",
	},
	{
		id: "policy",
		name: "Policy Document",
		description: "Official policies and guidelines",
		icon: "Shield",
		color: "blue",
	},
	{
		id: "report",
		name: "Report",
		description: "Analysis and status reports",
		icon: "FileText",
		color: "purple",
	},
	{
		id: "contract",
		name: "Contract",
		description: "Legal contracts and agreements",
		icon: "FileSignature",
		color: "orange",
	},
	{
		id: "memo",
		name: "Memorandum",
		description: "Internal memos and communications",
		icon: "Mail",
		color: "cyan",
	},
	{
		id: "invoice",
		name: "Invoice",
		description: "Financial invoices and receipts",
		icon: "Receipt",
		color: "red",
	},
];

export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "staff";
	avatar?: string;
	department?: string;
}

export interface SearchFilters {
	query?: string;
	documentType?: string;
	category?: string;
	tags?: string[];
	dateFrom?: Date;
	dateTo?: Date;
	uploadedBy?: string;
	status?: Document["status"];
	accessLevel?: Document["accessLevel"];
}

export interface Stats {
	totalDocuments: number;
	documentsThisMonth: number;
	totalCategories: number;
	totalSize: string;
}

// Navigation Item Type
export interface NavigationItem {
	name: string;
	href: string;
	icon: any;
	adminOnly?: boolean;
}

// Session User Type
export interface SessionUser {
	userId: string;
	email: string;
	name: string;
	role: "admin" | "staff";
	image?: string;
}
