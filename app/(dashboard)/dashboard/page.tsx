import {
    FileText,
    Upload,
    FolderOpen,
    TrendingUp,
    FileCheck,
    AlertCircle,
    Clock,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getDocumentStats, getRecentDocuments } from "@/actions/document.action";
import { getUserProfile } from "@/actions/user";

export default async function DashboardPage() {
    // Fetch real data from database
    const statsResult = await getDocumentStats();
    const recentDocsResult = await getRecentDocuments(5);
    const userProfile = await getUserProfile();

    const stats = statsResult.success ? statsResult.data : {
        totalDocuments: 0,
        documentsThisMonth: 0,
        totalStorage: 0,
        documentsByType: []
    };

    const recentDocuments = recentDocsResult.success ? recentDocsResult.data : [];

    // Count unique categories from documentsByType
    const totalCategories = stats.documentsByType?.length || 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back,
                        <span className="ml-1 font-semibold text-green-600">
                            {userProfile?.name || 'User'}
                        </span>
                        ! Here's an overview of your document management system.
                    </p>

                </div>
                <Link href="/documents/upload">
                    <Button className="gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <Upload className="h-4 w-4" />
                        Upload Document
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:border-blue-400/50 dark:hover:border-blue-600/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {stats.totalDocuments || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All documents in system
                        </p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg hover:border-purple-400/50 dark:hover:border-purple-600/50 animation-delay-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {stats.documentsThisMonth || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Documents uploaded</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:border-orange-400/50 dark:hover:border-orange-600/50 animation-delay-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Document Types</CardTitle>
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <FolderOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {totalCategories}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Active types</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg hover:border-green-400/50 dark:hover:border-green-600/50 animation-delay-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {stats.totalSize || "0 B"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Total file storage</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Documents & Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Documents */}
                <Card className="lg:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <CardTitle>Recent Documents</CardTitle>
                        </div>
                        <CardDescription>Latest uploaded documents in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentDocuments.length > 0 ? (
                            <div className="space-y-4">
                                {recentDocuments.map((doc: any, index: number) => (
                                    <Link
                                        key={doc.document_id}
                                        href={`/documents/${doc.document_id}`}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 ease-in-out cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{doc.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {doc.uploader_name || "Unknown"} • {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
                                            {doc.type}
                                        </Badge>
                                    </Link>
                                ))}</div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No documents yet</p>
                                <p className="text-xs mt-1">Upload your first document to get started</p>
                            </div>
                        )}
                        <Link href="/documents">
                            <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                                View All Documents
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/documents/upload">
                                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                                    <Upload className="h-4 w-4" />
                                    Upload Document
                                </Button>
                            </Link>
                            <Link href="/documents">
                                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                                    <FileText className="h-4 w-4" />
                                    View All Documents
                                </Button>
                            </Link>
                            <Link href="/categories">
                                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                                    <FolderOpen className="h-4 w-4" />
                                    Manage Categories
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm border-2 shadow-lg border-blue-200/50 dark:border-blue-800/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                <AlertCircle className="h-5 w-5" />
                                System Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{stats.totalDocuments || 0} Total Documents</p>
                                    <p className="text-xs text-muted-foreground">Stored in database</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{stats.documentsThisMonth || 0} This Month</p>
                                    <p className="text-xs text-muted-foreground">Recent uploads</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
