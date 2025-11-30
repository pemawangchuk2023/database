import {
    FileText,
    Upload,
    FolderOpen,
    TrendingUp,
    Clock,
    FileCheck,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mockDocuments, mockStats } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
    const recentDocuments = mockDocuments.slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here's an overview of your document management system.
                    </p>
                </div>
                <Link href="/documents/upload">
                    <Button className="gap-2 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                        <Upload className="h-4 w-4" />
                        Upload Document
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.totalDocuments}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-green-600 dark:text-green-400">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg animation-delay-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.documentsThisMonth}</div>
                        <p className="text-xs text-muted-foreground mt-1">Documents uploaded</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg animation-delay-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.totalCategories}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active categories</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg animation-delay-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockStats.totalSize}</div>
                        <p className="text-xs text-muted-foreground mt-1">of 4 GB total</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Documents & Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Documents */}
                <Card className="lg:col-span-2 bg-card/95 backdrop-blur-sm border shadow-lg">
                    <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                        <CardDescription>Latest uploaded documents in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentDocuments.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-all duration-300 ease-in-out cursor-pointer"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {doc.uploadedBy} • {formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {doc.documentType.name}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Link href="/documents">
                            <Button variant="outline" className="w-full mt-4">
                                View All Documents
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                    <Card className="bg-card/95 backdrop-blur-sm border shadow-lg">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/documents/upload">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Document
                                </Button>
                            </Link>
                            <Link href="/search">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <FileText className="h-4 w-4" />
                                    Search Documents
                                </Button>
                            </Link>
                            <Link href="/categories">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <FolderOpen className="h-4 w-4" />
                                    Manage Categories
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/95 backdrop-blur-sm border shadow-lg border-amber-500/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                <AlertCircle className="h-5 w-5" />
                                Pending Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">3 documents pending review</p>
                                    <p className="text-xs text-muted-foreground">Requires your approval</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Annual audit scheduled</p>
                                    <p className="text-xs text-muted-foreground">December 15, 2024</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
