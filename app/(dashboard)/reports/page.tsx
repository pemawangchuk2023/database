"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileBarChart, TrendingUp, Download, Calendar, Loader2, Printer } from "lucide-react";
import { getDocumentActivityStats, getUsageStats, getMonthlySummary } from "@/actions/report.action";
import { toast } from "sonner";

export default function Report() {
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [reportType, setReportType] = useState<string | null>(null);
	const [reportData, setReportData] = useState<any>(null);

	const handleGenerateReport = async (type: string) => {
		setLoading(true);
		setReportType(type);
		setReportData(null);

		try {
			let data;
			switch (type) {
				case "document-activity":
					data = await getDocumentActivityStats();
					break;
				case "usage-stats":
					data = await getUsageStats();
					break;
				case "monthly-summary":
					data = await getMonthlySummary();
					break;
			}

			if (data) {
				setReportData(data);
				setIsOpen(true);
				toast.success("Report generated successfully");
			} else {
				toast.error("Failed to generate report");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while generating the report");
		} finally {
			setLoading(false);
		}
	};

	const handlePrint = () => {
		window.print();
	};

	const renderReportContent = () => {
		if (!reportData) return null;

		switch (reportType) {
			case "document-activity":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div className="p-4 border rounded-lg bg-muted/50">
								<p className="text-sm font-medium text-muted-foreground">Total Documents</p>
								<p className="text-2xl font-bold">{reportData.totalDocs}</p>
							</div>
							<div className="p-4 border rounded-lg bg-muted/50">
								<p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
								<p className="text-2xl font-bold">{reportData.totalDownloads}</p>
							</div>
							<div className="p-4 border rounded-lg bg-muted/50">
								<p className="text-sm font-medium text-muted-foreground">Total Views</p>
								<p className="text-2xl font-bold">{reportData.totalViews}</p>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">Recent Uploads</h3>
							<div className="border rounded-lg overflow-hidden">
								<table className="w-full text-sm">
									<thead className="bg-muted">
										<tr>
											<th className="px-4 py-2 text-left">Title</th>
											<th className="px-4 py-2 text-left">Date</th>
										</tr>
									</thead>
									<tbody>
										{reportData.recentUploads.map((doc: any, i: number) => (
											<tr key={i} className="border-t">
												<td className="px-4 py-2">{doc.title}</td>
												<td className="px-4 py-2">{new Date(doc.created_at).toLocaleDateString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				);
			case "usage-stats":
				return (
					<div className="space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div className="p-4 border rounded-lg bg-muted/50">
								<p className="text-sm font-medium text-muted-foreground">Total Users</p>
								<p className="text-2xl font-bold">{reportData.totalUsers}</p>
							</div>
							<div className="p-4 border rounded-lg bg-muted/50">
								<p className="text-sm font-medium text-muted-foreground">Active Users (30d)</p>
								<p className="text-2xl font-bold">{reportData.activeUsers}</p>
							</div>
							<div className="p-4 border rounded-lg bg-muted/50">
								<p className="text-sm font-medium text-muted-foreground">Total Actions</p>
								<p className="text-2xl font-bold">{reportData.totalActions}</p>
							</div>
						</div>
						<div>
							<h3 className="font-semibold mb-2">Recent Activity</h3>
							<div className="border rounded-lg overflow-hidden">
								<table className="w-full text-sm">
									<thead className="bg-muted">
										<tr>
											<th className="px-4 py-2 text-left">User</th>
											<th className="px-4 py-2 text-left">Action</th>
											<th className="px-4 py-2 text-left">Date</th>
										</tr>
									</thead>
									<tbody>
										{reportData.recentActions.map((action: any, i: number) => (
											<tr key={i} className="border-t">
												<td className="px-4 py-2">{action.user_name}</td>
												<td className="px-4 py-2">{action.action}</td>
												<td className="px-4 py-2">{new Date(action.created_at).toLocaleDateString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				);
			case "monthly-summary":
				return (
					<div className="space-y-4">
						<div className="p-4 border rounded-lg bg-primary/10 mb-4">
							<h3 className="text-lg font-bold text-primary text-center">Summary for {reportData.month}</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-4 border rounded-lg flex flex-col items-center justify-center text-center">
								<p className="text-sm font-medium text-muted-foreground mb-1">New Documents</p>
								<p className="text-3xl font-bold">{reportData.newDocs}</p>
							</div>
							<div className="p-4 border rounded-lg flex flex-col items-center justify-center text-center">
								<p className="text-sm font-medium text-muted-foreground mb-1">New Users</p>
								<p className="text-3xl font-bold">{reportData.newUsers}</p>
							</div>
							<div className="p-4 border rounded-lg flex flex-col items-center justify-center text-center">
								<p className="text-sm font-medium text-muted-foreground mb-1">Total Activities</p>
								<p className="text-3xl font-bold">{reportData.activityCount}</p>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	const getReportTitle = () => {
		switch (reportType) {
			case "document-activity": return "Document Activity Report";
			case "usage-stats": return "Usage Statistics";
			case "monthly-summary": return "Monthly Summary";
			default: return "Report";
		}
	};

	return (
		<div className='space-y-6 animate-in fade-in duration-500 cyber-grid min-h-screen p-6'>
			{/* Page Header */}
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Reports & Analytics
				</h1>
				<p className='text-muted-foreground mt-1'>
					Generate and view system reports
				</p>
			</div>

			{/* Report Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card className='transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 neon-border-cyan hover:neon-glow-cyan cursor-pointer'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<FileBarChart className='h-8 w-8 text-primary' />
							<Button
								size='sm'
								variant='outline'
								onClick={() => handleGenerateReport("document-activity")}
								disabled={loading}
							>
								{loading && reportType === "document-activity" ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Download className='h-4 w-4 mr-2' />
								)}
								Generate
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<CardTitle className='mb-2'>Document Activity Report</CardTitle>
						<CardDescription>
							Overview of all document uploads, downloads, and modifications
						</CardDescription>
					</CardContent>
				</Card>

				<Card className='transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 neon-border-purple hover:neon-glow-purple cursor-pointer'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<TrendingUp className='h-8 w-8 text-green-600' />
							<Button
								size='sm'
								variant='outline'
								onClick={() => handleGenerateReport("usage-stats")}
								disabled={loading}
							>
								{loading && reportType === "usage-stats" ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Download className='h-4 w-4 mr-2' />
								)}
								Generate
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<CardTitle className='mb-2'>Usage Statistics</CardTitle>
						<CardDescription>
							User activity and system usage metrics over time
						</CardDescription>
					</CardContent>
				</Card>

				<Card className='transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 neon-border-magenta hover:neon-glow-magenta cursor-pointer'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<Calendar className='h-8 w-8 text-blue-600' />
							<Button
								size='sm'
								variant='outline'
								onClick={() => handleGenerateReport("monthly-summary")}
								disabled={loading}
							>
								{loading && reportType === "monthly-summary" ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Download className='h-4 w-4 mr-2' />
								)}
								Generate
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<CardTitle className='mb-2'>Monthly Summary</CardTitle>
						<CardDescription>
							Comprehensive monthly report of all system activities
						</CardDescription>
					</CardContent>
				</Card>
			</div>

			{/* Info Card */}
			<Card className='bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 neon-glow-purple'>
				<CardHeader>
					<CardTitle>About Reports</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2 text-sm text-muted-foreground'>
					<p>Reports are generated based on real-time data:</p>
					<ul className='list-disc list-inside space-y-1 ml-2'>
						<li>Document upload and download statistics</li>
						<li>User activity logs and access patterns</li>
						<li>Monthly performance summaries</li>
					</ul>
				</CardContent>
			</Card>

			{/* Report Dialog */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between">
							<span>{getReportTitle()}</span>
							<Button variant="ghost" size="icon" onClick={handlePrint} title="Print Report">
								<Printer className="h-5 w-5" />
							</Button>
						</DialogTitle>
						<DialogDescription>
							Generated on {new Date().toLocaleString()}
						</DialogDescription>
					</DialogHeader>

					<div className="mt-4 print:block">
						{renderReportContent()}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
