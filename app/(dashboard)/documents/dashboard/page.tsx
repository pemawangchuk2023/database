import {
    FileText,
    Upload,
    FolderOpen,
    TrendingUp,
    Clock,
    HardDrive,
    Search,
    BarChart3,
    AlertCircle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDocumentStats } from "@/actions/document.action";
import { DocumentTypes } from "@/types";

const DocumentsDashboard = async () => {
    // Fetch real stats from database
    const statsResult = await getDocumentStats();
    const stats = statsResult.success
        ? statsResult.data
        : {
            totalDocuments: 0,
            documentsThisMonth: 0,
            totalSize: "0 B",
            documentsByType: [],
        };

    // Calculate total types that have documents
    const activeTypes = stats.documentsByType?.length || 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Documents Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Overview and analytics of your document management system
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/documents/upload">
                        <Button className="gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                            <Upload className="h-4 w-4" />
                            Upload New
                        </Button>
                    </Link>
                    <Link href="/documents">
                        <Button
                            variant="outline"
                            className="gap-2 border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                        >
                            <FileText className="h-4 w-4" />
                            View All
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:border-blue-400/50 dark:hover:border-blue-600/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Documents
                        </CardTitle>
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
                        <p className="text-xs text-muted-foreground mt-1">
                            Documents uploaded
                        </p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200/50 dark:border-orange-800/50 shadow-lg hover:border-orange-400/50 dark:hover:border-orange-600/50 animation-delay-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Document Types
                        </CardTitle>
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <FolderOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {activeTypes}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Active types</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg hover:border-green-400/50 dark:hover:border-green-600/50 animation-delay-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <HardDrive className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {stats.totalSize || "0 B"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total file storage
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Document Type Distribution */}
            <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Documents by Type
                    </CardTitle>
                    <CardDescription>
                        Distribution of documents across different types
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {stats.documentsByType && stats.documentsByType.length > 0 ? (
                        <div className="space-y-4">
                            {stats.documentsByType.map((item: any, index: number) => {
                                const docType = DocumentTypes.find((t) => t.id === item.type);
                                const percentage =
                                    stats.totalDocuments > 0
                                        ? ((item.count / stats.totalDocuments) * 100).toFixed(1)
                                        : 0;

                                const gradients: { [key: string]: string } = {
                                    green: "from-green-500 to-emerald-500",
                                    blue: "from-blue-500 to-indigo-500",
                                    purple: "from-purple-500 to-violet-500",
                                    orange: "from-orange-500 to-amber-500",
                                    cyan: "from-cyan-500 to-teal-500",
                                    red: "from-red-500 to-rose-500",
                                };

                                const gradient =
                                    gradients[docType?.color || "blue"] ||
                                    "from-gray-500 to-slate-500";

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                                    >
                                        <div
                                            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
                                        >
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm">
                                                {docType?.name || item.type}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground w-12 text-right">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{item.count}</p>
                                            <p className="text-xs text-muted-foreground">documents</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">
                                No documents uploaded yet
                            </p>
                            <Link href="/documents/upload">
                                <Button className="mt-4 gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Your First Document
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm border-2 shadow-lg border-blue-200/50 dark:border-blue-800/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/documents/upload">
                            <Button
                                variant="destructive"
                                className="w-full h-auto cursor-pointer rounded-none flex-col gap-3 p-6 border-4 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                    <Upload className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-semibold">Upload Document</span>
                            </Button>
                        </Link>
                        <Link href="/documents">
                            <Button
                                variant="outline"
                                className="w-full h-auto flex-col gap-3 p-6 border-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Search className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-semibold">Search Documents</span>
                            </Button>
                        </Link>
                        <Link href="/documents/pending">
                            <Button
                                variant="outline"
                                className="w-full h-auto flex-col gap-3 p-6 border-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-semibold">Pending Approvals</span>
                            </Button>
                        </Link>
                        <Link href="/analytics">
                            <Button
                                variant="outline"
                                className="w-full h-auto flex-col gap-3 p-6 border-2 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <BarChart3 className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-semibold">View Analytics</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DocumentsDashboard;
