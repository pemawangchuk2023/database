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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getDocumentStats,
  getRecentDocuments,
  getPendingDocuments,
} from "@/actions/document.action";
import { getUserProfile } from "@/actions/user";
import { getSession } from "@/actions/auth";
import DashboardDocuments from "@/components/dashboard-documents";
import UserAvatar from "@/components/user-avatar";

const Dashboard = async () => {
  // Fetch real data from database
  const statsResult = await getDocumentStats();
  const recentDocsResult = await getRecentDocuments(10);
  const userProfile = await getUserProfile();
  const session = await getSession();

  // Fetch pending documents if user is admin
  const pendingDocsResult =
    session?.role === "admin" ? await getPendingDocuments() : null;
  const pendingDocumentsCount = pendingDocsResult?.success
    ? pendingDocsResult.data?.length || 0
    : 0;

  const stats = statsResult.success
    ? statsResult.data
    : {
        totalDocuments: 0,
        documentsThisMonth: 0,
        totalSize: "0 B",
        documentsByType: [],
      };

  const recentDocuments = recentDocsResult.success ? recentDocsResult.data : [];

  // Count unique categories from documentsByType
  const totalCategories = stats.documentsByType?.length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 cyber-grid min-h-screen p-6 bg-slate-50 dark:bg-transparent">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <UserAvatar
            name={userProfile?.name || "User"}
            image={userProfile?.image}
            size="lg"
            className="ring-2 ring-cyan-500/50 neon-glow-cyan hidden sm:block"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back,
              <span className="ml-2 text-pink-600 dark:text-pink-400">
                {userProfile?.name || "User"}
              </span>
              !
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm hidden sm:block font-medium">
              Here&apos;s an overview of your document management system.
            </p>
          </div>
        </div>
        <Link href="/documents/upload">
          <Button className="gap-2 shadow-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 border border-cyan-500/30 w-full sm:w-auto text-sm sm:text-base text-white">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white dark:bg-black/40 backdrop-blur-sm border border-cyan-200 dark:border-cyan-800 border-t-4 border-t-cyan-500 shadow-md hover:shadow-xl hover:shadow-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-cyan-900 dark:text-cyan-100">
              Total Documents
            </CardTitle>
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <FileText className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-cyan-950 dark:text-cyan-400">
              {stats.totalDocuments || 0}
            </div>
            <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300/60 mt-1">
              All documents in system
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white dark:bg-black/40 backdrop-blur-sm border border-pink-200 dark:border-pink-800 border-t-4 border-t-pink-500 shadow-md hover:shadow-xl hover:shadow-pink-500/20 animation-delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-pink-900 dark:text-pink-100">
              This Month
            </CardTitle>
            <div className="p-2 bg-pink-500/20 rounded-lg border border-pink-500/30">
              <TrendingUp className="h-4 w-4 text-pink-700 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-pink-950 dark:text-pink-400">
              {stats.documentsThisMonth || 0}
            </div>
            <p className="text-xs font-medium text-pink-700 dark:text-pink-300/60 mt-1">
              Documents uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white dark:bg-black/40 backdrop-blur-sm border border-purple-200 dark:border-purple-800 border-t-4 border-t-purple-500 shadow-md hover:shadow-xl hover:shadow-purple-500/20 animation-delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-purple-900 dark:text-purple-100">
              Document Types
            </CardTitle>
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <FolderOpen className="h-4 w-4 text-purple-700 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-950 dark:text-purple-400">
              {totalCategories}
            </div>
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300/60 mt-1">
              Active types
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white dark:bg-black/40 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800 border-t-4 border-t-emerald-500 shadow-md hover:shadow-xl hover:shadow-emerald-500/20 animation-delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
              Storage Used
            </CardTitle>
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <FileCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-400">
              {stats.totalSize || "0 B"}
            </div>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300/60 mt-1">
              Total file storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents & Quick Actions */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Documents */}
        <Card className="lg:col-span-2 bg-white/90 dark:bg-black/40 backdrop-blur-sm border border-cyan-100 dark:border-cyan-500/30 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <CardTitle className="text-slate-900 dark:text-cyan-100 font-bold">
                Recent Documents
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-cyan-300/60">
              Latest uploaded documents in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardDocuments documents={recentDocuments} itemsPerPage={4} />
            <Link href="/documents">
              <Button
                variant="outline"
                className="w-full mt-4 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-200 transition-all font-semibold"
              >
                View All Documents
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          {session?.role === "admin" && (
            <Link href="/documents/pending">
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-emerald-500/50 bg-white/80 dark:bg-black/40 backdrop-blur-sm hover:border-emerald-400 hover:neon-glow-cyan transition-all cursor-pointer">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-emerald-900 dark:text-emerald-100 text-sm">
                    Pending Approvals
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold text-emerald-900 bg-emerald-400 rounded-full">
                  {pendingDocumentsCount}
                </span>
              </div>
            </Link>
          )}

          <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border border-purple-100 dark:border-purple-500/30 shadow-sm hover:shadow-md transition-all mt-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-purple-100 font-bold">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/documents/upload">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-1.5 sm:gap-2 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-200 transition-all whitespace-normal text-left text-[11px] sm:text-xs leading-tight px-3 py-2 font-medium"
                >
                  <Upload className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Upload Document
                </Button>
              </Link>
              <Link href="/documents">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-1.5 sm:gap-2 border-purple-500/50 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-200 transition-all whitespace-normal text-left text-[11px] sm:text-xs leading-tight px-3 py-2 font-medium"
                >
                  <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  View All Documents
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-1.5 sm:gap-2 border-pink-500/50 text-pink-700 dark:text-pink-300 hover:bg-pink-500/10 hover:border-pink-400 hover:text-pink-600 dark:hover:text-pink-200 transition-all whitespace-normal text-left text-[11px] sm:text-xs leading-tight px-3 py-2 font-medium"
                >
                  <FolderOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Manage Categories
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border border-pink-100 dark:border-magenta-500/30 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-pink-100 font-bold">
                <AlertCircle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                System Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                    {stats.totalDocuments || 0} Total Documents
                  </p>
                  <p className="text-xs text-cyan-700 dark:text-cyan-300/60 font-medium">
                    Stored in database
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    {stats.documentsThisMonth || 0} This Month
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300/60 font-medium">
                    Recent uploads
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
