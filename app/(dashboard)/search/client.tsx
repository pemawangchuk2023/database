"use client";

import { useEffect, useState } from "react";
import { Search, FileText, Calendar, Tag, User } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import PaginationComponent from "@/components/shared/pagination-component";
import Link from "next/link";

interface SearchClientProps {
	documents: any[];
	documentTypes: any[];
}

const SearchClient = ({ documents, documentTypes }: SearchClientProps) => {
	const [filters, setFilters] = useState({
		query: "",
		documentType: "",
		accessLevel: "",
	});

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 4;

	// ✅ Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filters]);

	// ✅ Properly filtered documents
	const filteredDocuments = documents.filter((doc) => {
		const matchesQuery =
			!filters.query ||
			doc.title?.toLowerCase().includes(filters.query.toLowerCase()) ||
			doc.description?.toLowerCase().includes(filters.query.toLowerCase()) ||
			doc.tags?.some((tag: string) =>
				tag.toLowerCase().includes(filters.query.toLowerCase())
			);

		const matchesType =
			!filters.documentType || doc.type === filters.documentType;

		const matchesAccess =
			!filters.accessLevel || doc.access_level === filters.accessLevel;

		return matchesQuery && matchesType && matchesAccess;
	});

	// ✅ Pagination Logic
	const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

	const getAccessLevelColor = (level: string) => {
		switch (level) {
			case "public":
				return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
			case "internal":
				return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
			case "confidential":
				return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
			default:
				return "";
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / (1024 * 1024)).toFixed(1) + " MB";
	};

	const getDocumentTypeName = (typeId: string) => {
		const type = documentTypes.find((t) => t.id === typeId);
		return type?.name || typeId;
	};

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
				<p className="text-muted-foreground mt-1">
					Search and filter documents with advanced criteria
				</p>
			</div>

			{/* Search Filters */}
			<Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
				<CardHeader>
					<div>
						<CardTitle>Search Filters</CardTitle>
						<CardDescription>
							Refine your search with multiple criteria
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Search Input */}
					<div className="space-y-2">
						<Label htmlFor="search">Search Query</Label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="search"
								placeholder="Search by title, description, or tags..."
								value={filters.query}
								onChange={(e) =>
									setFilters({ ...filters, query: e.target.value })
								}
								className="pl-10"
							/>
						</div>
					</div>

					{/* Active Filters */}
					{(filters.query || filters.documentType || filters.accessLevel) && (
						<div className="flex flex-wrap gap-2 pt-4 border-t border-border">
							<span className="text-sm text-muted-foreground">
								Active filters:
							</span>

							{filters.query && (
								<Badge variant="secondary" className="gap-1">
									Query: {filters.query}
									<button
										onClick={() =>
											setFilters({ ...filters, query: "" })
										}
										className="ml-1 hover:text-destructive"
									>
										×
									</button>
								</Badge>
							)}

							{filters.documentType && (
								<Badge variant="secondary" className="gap-1">
									Type: {getDocumentTypeName(filters.documentType)}
									<button
										onClick={() =>
											setFilters({ ...filters, documentType: "" })
										}
										className="ml-1 hover:text-destructive"
									>
										×
									</button>
								</Badge>
							)}

							{filters.accessLevel && (
								<Badge variant="secondary" className="gap-1">
									Access: {filters.accessLevel}
									<button
										onClick={() =>
											setFilters({ ...filters, accessLevel: "" })
										}
										className="ml-1 hover:text-destructive"
									>
										×
									</button>
								</Badge>
							)}

							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									setFilters({ query: "", documentType: "", accessLevel: "" })
								}
								className="h-6 px-2 text-xs"
							>
								Clear all
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results Count */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					Found{" "}
					<span className="font-medium text-foreground">
						{filteredDocuments.length}
					</span>{" "}
					documents
				</p>
			</div>

			{/* Search Results */}
			<div className="space-y-3">
				{currentDocuments.map((doc, index) => (
					<Link key={doc.document_id}
						href={`/documents/${doc.document_id}`}
						className="block">
						<Card
							className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<FileText className="h-6 w-6" />
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex justify-between mb-2">
											<h3 className="font-semibold text-lg">{doc.title}</h3>
											<Badge
												variant="outline"
												className={getAccessLevelColor(doc.access_level)}
											>
												{doc.access_level}
											</Badge>
										</div>

										<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
											{doc.description || "No description"}
										</p>

										<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
											<Badge variant="secondary" className="text-xs">
												{getDocumentTypeName(doc.type)}
											</Badge>

											<div className="flex items-center gap-1">
												<User className="h-3.5 w-3.5" />
												{doc.uploader_name || "Unknown"}
											</div>

											<div className="flex items-center gap-1">
												<Calendar className="h-3.5 w-3.5" />
												{formatDistanceToNow(new Date(doc.created_at), {
													addSuffix: true,
												})}
											</div>

											<span>{formatFileSize(doc.file_size)}</span>
										</div>

										{doc.tags?.length > 0 && (
											<div className="flex flex-wrap items-center gap-2 mt-3">
												<Tag className="h-3.5 w-3.5 text-muted-foreground" />
												{doc.tags.map((tag: string, i: number) => (
													<Badge key={i} variant="outline" className="text-xs">
														{tag}
													</Badge>
												))}
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
				{filteredDocuments.length === 0 && (
					<Card>
						<CardContent className="p-12 text-center">
							<Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
							<h3 className="text-lg font-semibold mb-2">
								No documents found
							</h3>
							<p className="text-sm text-muted-foreground">
								Try adjusting your search criteria or filters
							</p>
						</CardContent>
					</Card>
				)}

				{totalPages > 1 && (
					<div className="flex justify-center pt-6">
						<PaginationComponent
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchClient;
