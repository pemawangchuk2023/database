"use client";

import { useState } from "react";
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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/actions/user.action";

interface AddUserDialogProps {
	departments: any[];
	isAdmin?: boolean;
}

const AddUserDialog = ({ departments, isAdmin }: AddUserDialogProps) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Only admins can add users
	if (!isAdmin) {
		return null;
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const result = await createUser(formData);

		if (result.success) {
			toast.success("User created successfully");
			setOpen(false);
			router.refresh();
			(e.target as HTMLFormElement).reset();
		} else {
			toast.error(result.error || "Failed to create user");
		}

		setIsLoading(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='gap-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-105'>
					<UserPlus className='h-4 w-4' />
					Add User
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[500px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add New User</DialogTitle>
						<DialogDescription>
							Create a new user account. The user will receive their login
							credentials.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input
								id='name'
								name='name'
								placeholder='Enter full name'
								required
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='user@finance.gov.bt'
								required
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								name='password'
								type='password'
								placeholder='Minimum 8 characters'
								minLength={8}
								required
								disabled={isLoading}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='role'>Role</Label>
							<Select name='role' required disabled={isLoading}>
								<SelectTrigger>
									<SelectValue placeholder='Select role' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='admin'>Admin</SelectItem>
									<SelectItem value='staff'>Staff</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='departmentId'>Department (Optional)</Label>
							<Select name='departmentId' disabled={isLoading}>
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
							{isLoading ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddUserDialog;
