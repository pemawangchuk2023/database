import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield } from "lucide-react";
import {
	getAllUsers,
	getUserStats,
	getAllDepartments,
} from "@/actions/user.action";
import { UsersClient } from "@/components/users-client";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import AddUserDialog from "@/components/add-user-dialog";
import { PendingUsersDialog } from "@/components/pending-users-dialog";
import { getPendingUsers } from "@/actions/auth";

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
	const pendingResult = isAdmin ? await getPendingUsers() : { data: [] };

	const users = usersResult.success ? usersResult.data : [];
	const departments = departmentsResult.success ? departmentsResult.data : [];
	const pendingCount = pendingResult.success ? (pendingResult.data?.length || 0) : 0;
	const stats = statsResult.success
		? statsResult.data
		: {
			totalUsers: 0,
			totalAdmins: 0,
			totalStaff: 0,
		};

	return (
		<div className='space-y-6 animate-in fade-in duration-500 cyber-grid min-h-screen p-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-cyan-900 dark:text-cyan-100'>
						User Management
					</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						{isAdmin
							? "Manage system users and their permissions"
							: "View system users"}
					</p>
				</div>
				{isAdmin && (
					<div className="flex gap-2">
						<PendingUsersDialog pendingCount={pendingCount} />
						<AddUserDialog departments={departments} isAdmin={isAdmin} />
					</div>
				)}
			</div>

			{/* Stats */}
			<div className='grid gap-4 md:grid-cols-3'>
				<Card className='bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 neon-border-cyan hover:neon-glow-cyan transition-all hover:-translate-y-1'>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10'>
								<Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Total Users
								</p>
								<p className='text-3xl font-bold text-cyan-600 dark:text-cyan-400'>
									{stats.totalUsers}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 neon-border-magenta hover:neon-glow-magenta transition-all hover:-translate-y-1'>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10'>
								<Shield className='h-6 w-6 text-red-600 dark:text-red-400' />
							</div>
							<div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Administrators
								</p>
								<p className='text-3xl font-bold text-pink-600 dark:text-pink-400'>
									{stats.totalAdmins}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='bg-white/80 dark:bg-black/40 backdrop-blur-sm border-2 neon-border-purple hover:neon-glow-purple transition-all hover:-translate-y-1'>
					<CardContent className='p-6'>
						<div className='flex items-center gap-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10'>
								<Users className='h-6 w-6 text-green-600 dark:text-green-400' />
							</div>
							<div>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									Staff Members
								</p>
								<p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
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
