"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, User, Tag, ArrowLeft, Trash2, FolderOpen } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/lib/file-upload";
import { deleteDocument } from "@/actions/document.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

export default function DocumentDetailsClient({ document }: { document: any }) {
    const router = useRouter();

    const handleDownload = async () => {
        try {
            toast.loading("Downloading...", { id: "download" });

            const response = await fetch(`/api/documents/${document.document_id}/download`);

            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = document.file_name;
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

    const handleDelete = async () => {
        const result = await deleteDocument(document.document_id);
        if (result.success) {
            toast.success("Document deleted successfully");
            router.push("/documents");
        } else {
            toast.error(result.error || "Failed to delete document");
        }
    };

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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/documents">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{document.title}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getAccessLevelColor(document.access_level)}>
                            {document.access_level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {document.file_name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {document.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                // Extract file extension from filename
                                const fileExtension = document.file_name?.split('.').pop()?.toLowerCase() || '';

                                if (fileExtension === 'pdf') {
                                    return (
                                        <iframe
                                            src={`/api/documents/${document.document_id}/view`}
                                            className="w-full h-[600px] rounded-lg border-2"
                                            title={document.title}
                                        />
                                    );
                                } else if (['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(fileExtension)) {
                                    return (
                                        <iframe
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + `/api/documents/${document.document_id}/view`)}`}
                                            className="w-full h-[600px] rounded-lg border-2"
                                            title={document.title}
                                        />
                                    );
                                } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
                                    return (
                                        <div className="flex items-center justify-center bg-muted/20 rounded-lg border-2 p-4">
                                            <img
                                                src={`/api/documents/${document.document_id}/view`}
                                                alt={document.title}
                                                className="max-w-full max-h-[600px] object-contain rounded-lg"
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed">
                                            <div className="text-center">
                                                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                                <p className="text-muted-foreground">
                                                    Preview not available for this file type
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    File type: {fileExtension.toUpperCase()}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Supported formats: PDF, DOCX, XLSX, PPTX, Images
                                                </p>
                                                <Button variant="outline" className="mt-4" onClick={handleDownload}>
                                                    Download to View
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">File Type</p>
                                    <p className="text-sm text-muted-foreground uppercase">{document.type}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                    <FolderOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Category</p>
                                    <p className="text-sm text-muted-foreground">{document.category_name || "Uncategorized"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-500/10 text-green-600">
                                    <Download className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Size</p>
                                    <p className="text-sm text-muted-foreground">{formatFileSize(document.file_size)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Uploaded By</p>
                                    <p className="text-sm text-muted-foreground">{document.uploader_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Uploaded</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            {document.tags && document.tags.length > 0 && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium mb-2">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {document.tags.map((tag: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full gap-2" onClick={handleDownload}>
                                <Download className="h-4 w-4" />
                                Download File
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Delete Document
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the document
                                            "{document.title}" from the database.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
