"use client";

import { useState } from "react";
import { FolderOpen, Plus, Edit, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { mockDocumentTypes, mockDocuments } from "@/types";
import { toast } from "sonner";

export default function CategoriesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
    });

    const getCategoryCount = (typeId: string) => {
        return mockDocuments.filter(doc => doc.documentType.id === typeId).length;
    };

    const handleCreateCategory = () => {
        if (!newCategory.name) {
            toast.error("Please enter a category name");
            return;
        }

        toast.success("Category created successfully!");
        setIsDialogOpen(false);
        setNewCategory({ name: "", description: "" });
    };

    const categoryColors = [
        "from-blue-500 to-blue-600",
        "from-amber-500 to-amber-600",
        "from-green-500 to-green-600",
        "from-purple-500 to-purple-600",
        "from-red-500 to-red-600",
        "from-emerald-500 to-emerald-600",
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Document Categories</h1>
                    <p className="text-muted-foreground mt-1">
                        Organize and manage document types and categories
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                            <Plus className="h-4 w-4" />
                            New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                                Add a new document category to organize your files
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Financial Reports"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter category description"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleCreateCategory} className="flex-1">
                                Create Category
                            </Button>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FolderOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Categories</p>
                                <p className="text-2xl font-bold">{mockDocumentTypes.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Documents</p>
                                <p className="text-2xl font-bold">{mockDocuments.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                <FolderOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg. per Category</p>
                                <p className="text-2xl font-bold">
                                    {Math.round(mockDocuments.length / mockDocumentTypes.length)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockDocumentTypes.map((type, index) => {
                    const count = getCategoryCount(type.id);
                    const colorClass = categoryColors[index % categoryColors.length];

                    return (
                        <Card
                            key={type.id}
                            className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg group cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} shadow-lg`}>
                                        <FolderOpen className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {type.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {type.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {count} {count === 1 ? 'document' : 'documents'}
                                        </span>
                                    </div>
                                    <Badge variant="secondary">{type.name}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Category Management Tips */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-lg border-blue-500/50">
                <CardHeader>
                    <CardTitle className="text-blue-600 dark:text-blue-400">Category Management Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Create specific categories to make document organization easier</p>
                    <p>• Use descriptive names that clearly indicate the type of documents</p>
                    <p>• Regularly review and consolidate categories to avoid duplication</p>
                    <p>• Assign appropriate access levels to categories based on document sensitivity</p>
                </CardContent>
            </Card>
        </div>
    );
}
