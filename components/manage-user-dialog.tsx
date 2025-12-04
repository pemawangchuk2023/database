"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/actions/user.action";

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
}

interface Department {
	department_id: string | number;
	name: string;
}

interface ManageUserDialogProps {
	user: User;
	departments: Department[];
}
export function ManageUserDialog({ user, departments }: ManageUserDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		email: user.email,
		role: user.role,
		departmentId: user.department_id ? String(user.department_id) : "",
	});

	// Update form data when user prop changes
	useEffect(() => {
		const role = (user.role || "staff").toLowerCase().trim();
		setFormData({
			name: user.name,
			email: user.email,
			role: role,
			departmentId: user.department_id ? String(user.department_id) : "",
		});
	}, [user, open]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const form = new FormData();
			form.append("name", formData.name.trim());
			form.append("email", formData.email.trim());
			form.append("role", formData.role.toLowerCase().trim());
			if (formData.departmentId) {
				form.append("departmentId", formData.departmentId);
			}

			const result = await updateUser(String(user.user_id), form);

			if (result.success) {
				toast.success("User updated successfully");
				setOpen(false);
				// Use a small delay to ensure server action completes
				setTimeout(() => router.refresh(), 100);
			} else {
				toast.error(result.error || "Failed to update user");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen} modal>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline' className='border-2'>
					<Settings className='h-4 w-4 mr-1' />
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<DialogDescription>
							Update user information and permissions
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input
								id='name'
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								placeholder='Enter full name'
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder='user@finance.gov.bt'
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='role'>Role</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='admin'>Admin</SelectItem>
									<SelectItem value='staff'>Staff</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='departmentId'>Department (Optional)</Label>
							<Select
								value={formData.departmentId}
								onValueChange={(value) =>
									setFormData({ ...formData, departmentId: value })
								}
								disabled={isLoading}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select department' />
								</SelectTrigger>
								<SelectContent>
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
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={isLoading}>
							{isLoading ? "Updating..." : "Update User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
