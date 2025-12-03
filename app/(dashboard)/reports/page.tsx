import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FileBarChart, TrendingUp, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Report = () => {
	return (
		<div className='space-y-6 animate-in fade-in duration-500'>
			{/* Page Header */}
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Reports & Analytics
				</h1>
				<p className='text-muted-foreground mt-1'>
					Generate and download system reports
				</p>
			</div>

			{/* Report Cards */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card className='transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<FileBarChart className='h-8 w-8 text-primary' />
							<Button size='sm' variant='outline'>
								<Download className='h-4 w-4 mr-2' />
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

				<Card className='transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<TrendingUp className='h-8 w-8 text-green-600' />
							<Button size='sm' variant='outline'>
								<Download className='h-4 w-4 mr-2' />
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

				<Card className='transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg cursor-pointer'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<Calendar className='h-8 w-8 text-blue-600' />
							<Button size='sm' variant='outline'>
								<Download className='h-4 w-4 mr-2' />
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
			<Card className='bg-card/95 backdrop-blur-sm border shadow-lg'>
				<CardHeader>
					<CardTitle>About Reports</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2 text-sm text-muted-foreground'>
					<p>Reports are generated in PDF format and include:</p>
					<ul className='list-disc list-inside space-y-1 ml-2'>
						<li>Document upload and download statistics</li>
						<li>User activity logs and access patterns</li>
						<li>Storage usage and trends</li>
						<li>Category-wise document distribution</li>
						<li>Compliance and audit information</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
};

export default Report;
