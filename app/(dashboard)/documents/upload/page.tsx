"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
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

export default function UploadDocumentPage() {
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

        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            toast.success("Document uploaded successfully!", {
                description: `${files.length} file(s) uploaded to the system`,
            });

            // Reset form
            setFiles([]);
            setFormData({
                title: "",
                description: "",
                documentType: "",
                category: "",
                tags: "",
                accessLevel: "internal",
            });
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
                <p className="text-muted-foreground mt-1">
                    Add new documents to the Ministry of Finance document management system
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardHeader>
                        <CardTitle>Select Files</CardTitle>
                        <CardDescription>
                            Drag and drop files here or click to browse. Supported formats: PDF, DOC, DOCX, XLS, XLSX, Images
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ease-in-out ${isDragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
                                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border"
                                    >
                                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
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
                                            className="flex-shrink-0"
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
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
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
                                    <SelectTrigger id="documentType">
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
                                />
                                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accessLevel">Access Level</Label>
                                <Select
                                    value={formData.accessLevel}
                                    onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}
                                >
                                    <SelectTrigger id="accessLevel">
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
                        className="flex-1 gap-2 shadow-lg"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Upload Document
                            </>
                        )}
                    </Button>
                    <Button type="button" variant="outline" disabled={uploading}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
