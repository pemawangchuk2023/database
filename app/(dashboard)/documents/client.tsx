"use client";

import { useState } from "react";
import { FileText, Grid, List, Download, Trash2 } from "lucide-react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { deleteDocument } from "@/actions/document.action";
import { useRouter } from "next/navigation";

interface DocumentsClientProps {
    documents: any[];
    documentTypes: any[];
}

export default function DocumentsClient({ documents: initialDocuments, documentTypes }: DocumentsClientProps) {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [documents, setDocuments] = useState(initialDocuments);

    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "all" || doc.type === selectedType;
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

    const handleDelete = async (id: number) => {
        const result = await deleteDocument(id.toString());
        if (result.success) {
            toast.success("Document deleted successfully");
            setDocuments(documents.filter(doc => doc.document_id !== id));
        } else {
            toast.error(result.error || "Failed to delete document");
        }
    };

    const handleDownload = async (doc: any) => {
        try {
            toast.loading("Downloading...", { id: "download" });

            const response = await fetch(`/api/documents/${doc.document_id}/download`);

            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.file_name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Download complete", { id: "download" });
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download document", { id: "download" });
        }
    };

    const getDocumentTypeName = (typeId: string) => {
        const type = documentTypes.find(t => t.id === typeId);
        return type?.name || typeId;
    };

    const handleDocumentClick = (id: string) => {
        router.push(`/documents/${id}`);
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
                    <Button className="gap-2 shadow-lg rounded-none cursor-pointer">
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
                                {documentTypes.map((type) => (
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

            {/* Empty State */}
            {filteredDocuments.length === 0 && (
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery || selectedType !== "all"
                                ? "Try adjusting your filters"
                                : "Upload your first document to get started"}
                        </p>
                        <Link href="/documents/upload">
                            <Button>Upload Document</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Documents Grid View */}
            {viewMode === "grid" && filteredDocuments.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDocuments.map((doc, index) => (
                        <Card
                            key={doc.document_id}
                            className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer group"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => handleDocumentClick(doc.document_id)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <Badge variant="outline" className={getAccessLevelColor(doc.access_level)}>
                                        {doc.access_level}
                                    </Badge>
                                </div>
                                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {doc.description || "No description"}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="text-xs">
                                        {getDocumentTypeName(doc.type)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {formatFileSize(doc.file_size)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                                    <span>{doc.uploader_name || "Unknown"}</span>
                                    <span>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
                                </div>
                                <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 gap-1 rounded-none"
                                        onClick={() => handleDownload(doc)}
                                    >
                                        <Download className="h-3 w-3" />
                                        Download
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1 rounded-none text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the document
                                                    "{doc.title}" from the database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(doc.document_id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Documents List View */}
            {viewMode === "list" && filteredDocuments.length > 0 && (
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
                                <TableRow
                                    key={doc.document_id}
                                    className="cursor-pointer hover:bg-accent/50"
                                    onClick={() => handleDocumentClick(doc.document_id)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{doc.title}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {doc.description || "No description"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{getDocumentTypeName(doc.type)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getAccessLevelColor(doc.access_level)}>
                                            {doc.access_level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatFileSize(doc.file_size)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{doc.uploader_name || "Unknown"}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDownload(doc)}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the document
                                                            "{doc.title}" from the database.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(doc.document_id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
