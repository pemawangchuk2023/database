"use client";

import { useState } from "react";
import { Search, Filter, FileText, Calendar, Tag, User, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockDocuments, mockDocumentTypes, SearchFilters } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function SearchPage() {
    const [filters, setFilters] = useState<SearchFilters>({
        query: "",
        documentType: "",
        accessLevel: undefined,
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    const filteredDocuments = mockDocuments.filter((doc) => {
        const matchesQuery = !filters.query ||
            doc.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            doc.description.toLowerCase().includes(filters.query.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));

        const matchesType = !filters.documentType || doc.documentType.id === filters.documentType;
        const matchesAccess = !filters.accessLevel || doc.accessLevel === filters.accessLevel;

        return matchesQuery && matchesType && matchesAccess;
    });

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
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Search Filters</CardTitle>
                            <CardDescription>Refine your search with multiple criteria</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {showAdvanced ? "Hide" : "Show"} Advanced
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Main Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Search Query</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by title, description, or tags..."
                                value={filters.query}
                                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvanced && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4 border-t border-border">
                            <div className="space-y-2">
                                <Label htmlFor="documentType">Document Type</Label>
                                <Select
                                    value={filters.documentType}
                                    onValueChange={(value) => setFilters({ ...filters, documentType: value })}
                                >
                                    <SelectTrigger id="documentType">
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Types</SelectItem>
                                        {mockDocumentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accessLevel">Access Level</Label>
                                <Select
                                    value={filters.accessLevel || ""}
                                    onValueChange={(value) => setFilters({ ...filters, accessLevel: value as any })}
                                >
                                    <SelectTrigger id="accessLevel">
                                        <SelectValue placeholder="All levels" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Levels</SelectItem>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="internal">Internal</SelectItem>
                                        <SelectItem value="confidential">Confidential</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <Input type="date" placeholder="From date" />
                            </div>
                        </div>
                    )}

                    {/* Active Filters */}
                    {(filters.query || filters.documentType || filters.accessLevel) && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {filters.query && (
                                <Badge variant="secondary" className="gap-1">
                                    Query: {filters.query}
                                    <button
                                        onClick={() => setFilters({ ...filters, query: "" })}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {filters.documentType && (
                                <Badge variant="secondary" className="gap-1">
                                    Type: {mockDocumentTypes.find(t => t.id === filters.documentType)?.name}
                                    <button
                                        onClick={() => setFilters({ ...filters, documentType: "" })}
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
                                        onClick={() => setFilters({ ...filters, accessLevel: undefined })}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilters({ query: "", documentType: "", accessLevel: undefined })}
                                className="h-6 px-2 text-xs"
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Found <span className="font-medium text-foreground">{filteredDocuments.length}</span> documents
                </p>
            </div>

            {/* Search Results */}
            <div className="space-y-3">
                {filteredDocuments.map((doc, index) => (
                    <Card
                        key={doc.id}
                        className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="font-semibold text-lg">{doc.title}</h3>
                                        <Badge variant="outline" className={getAccessLevelColor(doc.accessLevel)}>
                                            {doc.accessLevel}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {doc.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-3.5 w-3.5" />
                                            <Badge variant="secondary" className="text-xs">
                                                {doc.documentType.name}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            <span>{doc.uploadedBy}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>{formatFileSize(doc.fileSize)}</span>
                                        </div>
                                    </div>
                                    {doc.tags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                            {doc.tags.map((tag, i) => (
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
                ))}

                {filteredDocuments.length === 0 && (
                    <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your search criteria or filters
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
