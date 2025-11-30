"use client";

import { useState } from "react";
import { FileText, Filter, Grid, List, Download, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockDocuments, mockDocumentTypes } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function DocumentsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");

    const filteredDocuments = mockDocuments.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "all" || doc.documentType.id === selectedType;
        return matchesSearch && matchesType;
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse and manage all documents in the system
                    </p>
                </div>
                <Link href="/documents/upload">
                    <Button className="gap-2 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                        <FileText className="h-4 w-4" />
                        Upload New
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex-1">
                            <Input
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-full md:w-[200px] bg-background">
                                <SelectValue placeholder="Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {mockDocumentTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredDocuments.length}</span> documents
                </p>
            </div>

            {/* Documents Grid View */}
            {viewMode === "grid" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDocuments.map((doc, index) => (
                        <Card
                            key={doc.id}
                            className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <Badge variant="outline" className={getAccessLevelColor(doc.accessLevel)}>
                                        {doc.accessLevel}
                                    </Badge>
                                </div>
                                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {doc.description}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="text-xs">
                                        {doc.documentType.name}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {formatFileSize(doc.fileSize)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                                    <span>{doc.uploadedBy}</span>
                                    <span>{formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                                        <Eye className="h-3 w-3" />
                                        View
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                                        <Download className="h-3 w-3" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Documents List View */}
            {viewMode === "list" && (
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Access Level</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocuments.map((doc) => (
                                <TableRow key={doc.id} className="cursor-pointer hover:bg-accent/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {doc.description}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{doc.documentType.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getAccessLevelColor(doc.accessLevel)}>
                                            {doc.accessLevel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatFileSize(doc.fileSize)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{doc.uploadedBy}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button size="icon" variant="ghost">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
