"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ManageUserDialog } from "@/components/manage-user-dialog";
import { DeleteUserDialog } from "@/components/delete-user-dialog";
import { formatDistanceToNow } from "date-fns";
import { Users, Search, X, Clock, CheckCircle } from "lucide-react";
import UserAvatar from "@/components/user-avatar";

interface User {
	user_id: string | number;
	name: string;
	email: string;
	role: string;
	image?: string;
	created_at: string;
	updated_at: string;
	department_id?: string | number;
	department_name?: string;
	status?: string;
	approved_by?: string;
}

interface Department {
	department_id: string | number;
	name: string;
}

interface UsersClientProps {
	users: User[];
	departments: Department[];
	currentUserId?: string | number;
	isAdmin?: boolean;
}

export function UsersClient({
	users,
	departments,
	currentUserId,
	isAdmin = false,
}: UsersClientProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRole, setSelectedRole] = useState<string>("all");
	const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

	const filteredUsers = useMemo(() => {
		return users.filter((user) => {
			const matchesSearch =
				searchTerm === "" ||
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesRole = selectedRole === "all" || user.role === selectedRole;

			const matchesDepartment =
				selectedDepartment === "all" ||
				user.department_id?.toString() === selectedDepartment;

			return matchesSearch && matchesRole && matchesDepartment;
		});
	}, [users, searchTerm, selectedRole, selectedDepartment]);

	const getRoleBadge = (role: string) => {
		switch (role) {
			case "admin":
				return (
					<Badge className='bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'>
						Admin
					</Badge>
				);
			default:
				return (
					<Badge className='bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'>
						Staff
					</Badge>
				);
		}
	};

	const getStatusBadge = (lastActive: string) => {
		const lastActiveDate = new Date(lastActive);
		const now = new Date();
		const diffInHours =
			(now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 1) {
			return (
				<div className='flex items-center gap-1'>
					<CheckCircle className='h-3 w-3 text-green-500' />
					<Badge className='bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-xs'>
						Online
					</Badge>
				</div>
			);
		} else if (diffInHours < 24) {
			return (
				<div className='flex items-center gap-1'>
					<Clock className='h-3 w-3 text-yellow-500' />
					<Badge className='bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 text-xs'>
						Away
					</Badge>
				</div>
			);
		} else {
			return (
				<div className='flex items-center gap-1'>
					<Clock className='h-3 w-3 text-gray-400' />
					<Badge className='bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20 text-xs'>
						Inactive
					</Badge>
				</div>
			);
		}
	};

	const getAccountStatusBadge = (status?: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge className='bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'>
						Pending
					</Badge>
				);
			case "rejected":
				return (
					<Badge className='bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'>
						Rejected
					</Badge>
				);
			case "active":
			default:
				return (
					<Badge className='bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'>
						Active
					</Badge>
				);
		}
	};

	return (
		<Card className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 shadow-lg'>
			<CardHeader>
				<CardTitle>All Users</CardTitle>
				<CardDescription>Manage user accounts and permissions</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{/* Filters */}
				<div className='grid gap-4 md:grid-cols-3'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
						<Input
							placeholder='Search by name or email...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='pl-10 border-2'
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm("")}
								className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded'
								title='Clear search'
								aria-label='Clear search'
							>
								<X className='h-4 w-4 text-gray-500' />
							</button>
						)}
					</div>

					<Select value={selectedRole} onValueChange={setSelectedRole}>
						<SelectTrigger className='border-2'>
							<SelectValue placeholder='Filter by role' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Roles</SelectItem>
							<SelectItem value='admin'>Admin</SelectItem>
							<SelectItem value='staff'>Staff</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={selectedDepartment}
						onValueChange={setSelectedDepartment}
					>
						<SelectTrigger className='border-2'>
							<SelectValue placeholder='Filter by department' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All Departments</SelectItem>
							{departments.map((dept) => (
								<SelectItem
									key={dept.department_id}
									value={dept.department_id.toString()}
								>
									{dept.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Results Count */}
				<div className='text-sm text-gray-600 dark:text-gray-400'>
					Showing {filteredUsers.length} of {users.length} users
				</div>

				{/* Users List */}
				{filteredUsers.length > 0 ? (
					<div className='space-y-2 max-h-[600px] overflow-y-auto pr-2'>
						{filteredUsers.map((user) => (
							<div
								key={user.user_id}
								className='flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 group animate-in fade-in'
							>
								<UserAvatar
									name={user.name}
									image={user.image}
									size='md'
									className='h-12 w-12 flex-shrink-0'
								/>
								<div className='flex-1 min-w-0'>
									<p className='font-medium text-gray-900 dark:text-white truncate'>
										{user.name}
									</p>
									<p className='text-sm text-gray-600 dark:text-gray-400 truncate'>
										{user.email}
									</p>
								</div>
								<div className='flex items-center gap-3 flex-wrap justify-end'>
									{user.department_name && (
										<div className='text-right hidden sm:block flex-shrink-0'>
											<p className='text-sm font-medium text-gray-900 dark:text-white'>
												{user.department_name}
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-500'>
												Department
											</p>
										</div>
									)}
									{getAccountStatusBadge(user.status)}
									{getRoleBadge(user.role)}
									{getStatusBadge(user.updated_at)}
									<div className='text-right hidden lg:block flex-shrink-0'>
										<p className='text-xs text-gray-500 dark:text-gray-500'>
											Joined{" "}
											{formatDistanceToNow(new Date(user.created_at), {
												addSuffix: true,
											})}
										</p>
									</div>
									{isAdmin && (
										<div className='flex gap-2 flex-shrink-0'>
											<ManageUserDialog user={user} departments={departments} />
											<DeleteUserDialog
												user={user}
												currentUserId={
													currentUserId ? String(currentUserId) : undefined
												}
											/>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-12 text-gray-500'>
						<Users className='h-12 w-12 mx-auto mb-4 opacity-50' />
						<p>
							{searchTerm ||
								selectedRole !== "all" ||
								selectedDepartment !== "all"
								? "No users found matching your filters"
								: "No users found"}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
