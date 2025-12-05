"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockDocumentTypes } from "@/types";
import { toast } from "sonner";
import { uploadDocument } from "@/actions/document.action";
import { useRouter } from "next/navigation";

export default function UploadDocumentPage() {
    const router = useRouter()
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        documentType: "",
        category: "",
        tags: "",
        accessLevel: "internal",
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'image/*': ['.png', '.jpg', '.jpeg'],
        },
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (files.length === 0) {
            toast.error("Please select at least one file to upload");
            return;
        }

        if (!formData.title || !formData.documentType) {
            toast.error("Please fill in all required fields");
            return;
        }

        setUploading(true);

        try {
            for (const file of files) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                uploadFormData.append("title", formData.title);
                uploadFormData.append("description", formData.description);
                uploadFormData.append("documentType", formData.documentType);
                uploadFormData.append("category", formData.category);
                uploadFormData.append("tags", formData.tags);
                uploadFormData.append("accessLevel", formData.accessLevel);

                const result = await uploadDocument(uploadFormData);

                if (result.error) {
                    toast.error(result.error);
                    setUploading(false);
                    return;
                }
            }

            toast.success("Document uploaded successfully!", {
                description: `${files.length} file(s) uploaded to the system`,
            });
            router.push("/dashboard")
            setFiles([]);
            setFormData({
                title: "",
                description: "",
                documentType: "",
                category: "",
                tags: "",
                accessLevel: "internal",
            });
        } catch (error) {
            toast.error("Failed to upload document");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Upload Document
                </h1>
                <p className="text-muted-foreground mt-1">
                    Add new documents to the Ministry of Finance document management system
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <CardTitle>Select Files</CardTitle>
                        </div>
                        <CardDescription>
                            Drag and drop files here or click to browse. Supported formats: PDF, DOC, DOCX, XLS, XLSX, Images
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ease-in-out ${isDragActive
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                : "border-border hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                            {isDragActive ? (
                                <p className="text-lg font-medium">Drop the files here...</p>
                            ) : (
                                <>
                                    <p className="text-lg font-medium mb-2">Drag & drop files here</p>
                                    <p className="text-sm text-muted-foreground">or click to select files</p>
                                </>
                            )}
                        </div>

                        {/* Selected Files */}
                        {files.length > 0 && (
                            <div className="mt-6 space-y-2">
                                <Label>Selected Files ({files.length})</Label>
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                                    >
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFile(index)}
                                            className="flex-shrink-0 hover:bg-red-100 dark:hover:bg-red-950/30"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Document Details */}
                <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 shadow-lg">
                    <CardHeader>
                        <CardTitle>Document Details</CardTitle>
                        <CardDescription>Provide information about the document</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter document title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="border-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter document description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="border-2"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="documentType">
                                    Document Type <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.documentType}
                                    onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                                    required
                                >
                                    <SelectTrigger id="documentType" className="border-2">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockDocumentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g., Financial Reports"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="border-2"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    placeholder="e.g., budget, 2024, quarterly"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="border-2"
                                />
                                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accessLevel">Access Level</Label>
                                <Select
                                    value={formData.accessLevel}
                                    onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}
                                >
                                    <SelectTrigger id="accessLevel" className="border-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="internal">Internal</SelectItem>
                                        <SelectItem value="confidential">Confidential</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        className="flex-1 gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Upload Document
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        className="border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
