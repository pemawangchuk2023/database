"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUser } from "@/actions/user.action";

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

interface DeleteUserDialogProps {
	user: User;
	currentUserId?: string;
}
export function DeleteUserDialog({
	user,
	currentUserId,
}: DeleteUserDialogProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// Prevent self-deletion
	if (currentUserId && currentUserId === user.user_id) {
		return (
			<Button
				size='sm'
				variant='outline'
				className='border-2 border-gray-300 text-gray-400 cursor-not-allowed'
				disabled
			>
				<Trash2 className='h-4 w-4 mr-1' />
				Delete
			</Button>
		);
	}

	async function handleDelete() {
		setIsLoading(true);

		try {
			const result = await deleteUser(String(user.user_id));

			if (result.success) {
				toast.success("User deleted successfully");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete user");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					size='sm'
					variant='outline'
					className='border-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20'
				>
					<Trash2 className='h-4 w-4 mr-1' />
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete User</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete{" "}
						<span className='font-semibold'>{user.name}</span>? This action
						cannot be undone and will remove all associated data.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isLoading}
						className='bg-red-600 hover:bg-red-700 focus:ring-red-500'
					>
						{isLoading ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
