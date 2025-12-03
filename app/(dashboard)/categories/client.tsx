"use client";

import { useState } from "react";
import { FolderOpen, Plus, Edit, Trash2, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { createCategory, updateCategory, deleteCategory } from "@/actions/category.action";

interface CategoriesClientProps {
    categories: any[];
    stats: any;
    userRole: "admin" | "staff";
}

export default function CategoriesClient({ categories, stats, userRole }: CategoriesClientProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!formData.name) {
            toast.error("Please enter a category name");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);

        const result = await createCategory(data);
        setLoading(false);

        if (result.success) {
            toast.success("Category created successfully");
            setIsCreateOpen(false);
            setFormData({ name: "", description: "" });
        } else {
            toast.error(result.error || "Failed to create category");
        }
    };

    const handleUpdate = async () => {
        if (!formData.name) {
            toast.error("Please enter a category name");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);

        const result = await updateCategory(selectedCategory.category_id, data);
        setLoading(false);

        if (result.success) {
            toast.success("Category updated successfully");
            setIsEditOpen(false);
            setSelectedCategory(null);
            setFormData({ name: "", description: "" });
        } else {
            toast.error(result.error || "Failed to update category");
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteCategory(selectedCategory.category_id);
        setLoading(false);

        if (result.success) {
            toast.success("Category deleted successfully");
            setIsDeleteOpen(false);
            setSelectedCategory(null);
        } else {
            toast.error(result.error || "Failed to delete category");
        }
    };

    const openEditDialog = (category: any) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (category: any) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    const categoryColors = [
        "from-blue-500 to-blue-600",
        "from-amber-500 to-amber-600",
        "from-green-500 to-green-600",
        "from-purple-500 to-purple-600",
        "from-red-500 to-red-600",
        "from-emerald-500 to-emerald-600",
    ];

    const totalDocuments = stats?.totalDocuments || 0;
    const avgPerCategory = categories.length > 0 ? Math.round(totalDocuments / categories.length) : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Document Categories
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Organize and manage document types and categories
                    </p>
                </div>
                {userRole === "admin" && (
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                        <Plus className="h-4 w-4" />
                        New Category
                    </Button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <FolderOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Categories</p>
                                <p className="text-2xl font-bold">{categories.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Documents</p>
                                <p className="text-2xl font-bold">{totalDocuments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200/50 dark:border-amber-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <FolderOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg. per Category</p>
                                <p className="text-2xl font-bold">{avgPerCategory}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => {
                    const colorClass = categoryColors[index % categoryColors.length];

                    return (
                        <Card
                            key={category.category_id}
                            className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} shadow-lg`}>
                                        <FolderOpen className="h-7 w-7 text-white" />
                                    </div>
                                    {userRole === "admin" && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                onClick={() => openEditDialog(category)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20 text-destructive hover:text-red-600"
                                                onClick={() => openDeleteDialog(category)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                                    {category.description || "No description provided"}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {category.document_count || 0} documents
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter category description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={loading}>
                            {loading ? "Creating..." : "Create Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update category details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Category Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category
                            "{selectedCategory?.name}".
                            {selectedCategory?.document_count > 0 && (
                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded flex items-start gap-2 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                                    <span>
                                        Warning: This category contains {selectedCategory.document_count} documents.
                                        You must delete or reassign them before deleting the category.
                                    </span>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={loading || (selectedCategory?.document_count > 0)}
                        >
                            {loading ? "Deleting..." : "Delete Category"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
