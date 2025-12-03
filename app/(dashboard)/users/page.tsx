import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield } from "lucide-react";
import {
	getAllUsers,
	getUserStats,
	getAllDepartments,
} from "@/actions/user.action";
import { UsersClient } from "@/components/users-client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AddUserDialog from "@/components/add-user-dialog";

export default async function UsersPage() {
	// Get session to determine user role
	const session = await getSession();
	if (!session) {
		redirect("/auth/login");
	}

	const isAdmin = session.role === "admin";

	// Fetch real data from database
	const usersResult = await getAllUsers();
	const statsResult = await getUserStats();
	const departmentsResult = await getAllDepartments();

	const users = usersResult.success ? usersResult.data : [];
	const departments = departmentsResult.success ? departmentsResult.data : [];
	const stats = statsResult.success
		? statsResult.data
		: {
			totalUsers: 0,
			totalAdmins: 0,
			totalStaff: 0,
		};

	return (
		<div className='space-y-6 animate-in fade-in duration-500'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'>
						User Management
					</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						{isAdmin ? "Manage system users and their permissions" : "View system users"}
					</p>
				</div>
				{isAdmin && (
					<AddUserDialog
						departments={departments}
						isAdmin={isAdmin}
					/>
				)}
			</div>

			{/* Stats */}
			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1'>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10'>
								<Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Total Users
								</p>
								<p className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
									{stats.totalUsers}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200/50 dark:border-red-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1'>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10'>
								<Shield className='h-6 w-6 text-red-600 dark:text-red-400' />
							</div>
							<div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Administrators
								</p>
								<p className='text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent'>
									{stats.totalAdmins}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1'>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10'>
								<Users className='h-6 w-6 text-green-600 dark:text-green-400' />
							</div>
							<div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Staff Members
								</p>
								<p className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
									{stats.totalStaff}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users List */}
			<UsersClient
				users={users}
				departments={departments}
				currentUserId={session?.userId}
				isAdmin={isAdmin}
			/>
		</div>
	);
}
