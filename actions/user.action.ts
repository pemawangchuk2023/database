"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/permissions";

export type ActionResponse = {
	success?: boolean;
	error?: string;
	data?: any;
};

/**
 * Get all users from database
 */
export async function getAllUsers(): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		const result = await pool.query(`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.role,
        u.image,
        u.created_at,
        u.updated_at,
        u.department_id,
        d.name as department_name
      FROM Users u
      LEFT JOIN Department d ON u.department_id = d.department_id
      ORDER BY u.created_at DESC
    `);

		return {
			success: true,
			data: result.rows,
		};
	} catch (error) {
		console.error("Get all users error:", error);
		return { error: "Failed to fetch users" };
	}
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		const result = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE role = 'admin') as total_admins,
        COUNT(*) FILTER (WHERE role = 'staff') as total_staff,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_month
      FROM Users
    `);

		const stats = result.rows[0];

		return {
			success: true,
			data: {
				totalUsers: parseInt(stats.total_users),
				totalAdmins: parseInt(stats.total_admins),
				totalStaff: parseInt(stats.total_staff),
				newUsersThisMonth: parseInt(stats.new_users_month),
			},
		};
	} catch (error) {
		console.error("Get user stats error:", error);
		return { error: "Failed to fetch user statistics" };
	}
}

/**
 * Create a new user
 */
export async function createUser(formData: FormData): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userCheck = await pool.query(
			"SELECT role FROM Users WHERE user_id = $1",
			[parseInt(session.userId) || session.userId]
		);

		if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
			return { error: "Only administrators can create users" };
		}
		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			role: formData.get("role") || "staff",
			departmentId: formData.get("departmentId"),
		};

		const schema = z.object({
			name: z.string().min(2, "Name must be at least 2 characters"),
			email: z.string().email("Invalid email address"),
			password: z.string().min(8, "Password must be at least 8 characters"),
			role: z.enum(["admin", "staff"]),
			departmentId: z.string().optional(),
		});

		const validated = schema.parse(data);

		// Check if email already exists
		const emailCheck = await pool.query(
			"SELECT user_id FROM Users WHERE email = $1",
			[validated.email]
		);

		if (emailCheck.rows.length > 0) {
			return { error: "Email already exists" };
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(validated.password, 10);

		// Create user
		const result = await pool.query(
			`INSERT INTO Users (name, email, password, role, department_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
			[
				validated.name,
				validated.email,
				hashedPassword,
				validated.role,
				validated.departmentId || null,
			]
		);

		revalidatePath("/users");

		return {
			success: true,
			data: { userId: result.rows[0].user_id },
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Create user error:", error);
		return { error: "Failed to create user" };
	}
}

/**
 * Update user
 */
export async function updateUser(
	userId: string,
	formData: FormData
): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userCheck = await pool.query(
			"SELECT role FROM Users WHERE user_id = $1",
			[parseInt(session.userId) || session.userId]
		);

		if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
			return { error: "Only administrators can update users" };
		}

		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			role: formData.get("role"),
			departmentId: formData.get("departmentId"),
		};

		const schema = z.object({
			name: z.string().min(2).optional(),
			email: z.string().email().optional(),
			role: z.enum(["admin", "staff"]).optional(),
			departmentId: z.string().optional(),
		});

		const validated = schema.parse(data);

		const updates: string[] = [];
		const params: any[] = [];
		let paramCount = 0;

		if (validated.name) {
			params.push(validated.name);
			updates.push(`name = $${++paramCount}`);
		}

		if (validated.email) {
			params.push(validated.email);
			updates.push(`email = $${++paramCount}`);
		}

		if (validated.role) {
			params.push(validated.role);
			updates.push(`role = $${++paramCount}`);
		}

		if (validated.departmentId) {
			params.push(validated.departmentId);
			updates.push(`department_id = $${++paramCount}`);
		}

		if (updates.length === 0) {
			return { error: "No fields to update" };
		}

		params.push(userId);
		const query = `
      UPDATE Users 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $${++paramCount}
    `;

		await pool.query(query, params);

		revalidatePath("/users");

		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Update user error:", error);
		return { error: "Failed to update user" };
	}
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userCheck = await pool.query(
			"SELECT role FROM Users WHERE user_id = $1",
			[parseInt(session.userId) || session.userId]
		);

		if (!userCheck.rows[0] || userCheck.rows[0].role !== "admin") {
			return { error: "Only administrators can delete users" };
		}

		// Prevent self-deletion
		const sessionUserId = parseInt(session.userId) || session.userId;
		const targetUserId = parseInt(userId) || userId;
		if (sessionUserId === targetUserId) {
			return { error: "You cannot delete your own account" };
		}

		await pool.query("DELETE FROM Users WHERE user_id = $1", [targetUserId]);

		revalidatePath("/users");

		return { success: true };
	} catch (error) {
		console.error("Delete user error:", error);
		return { error: "Failed to delete user" };
	}
}

/**
 * Get user role for client-side permission checks
 */
export async function getUserRole(): Promise<{
	role: string | null;
	isAdmin: boolean;
}> {
	try {
		const session = await getSession();
		if (!session) {
			return { role: null, isAdmin: false };
		}

		const userIsAdmin = await isAdmin(session.userId);

		return {
			role: session.role || null,
			isAdmin: userIsAdmin,
		};
	} catch (error) {
		console.error("Get user role error:", error);
		return { role: null, isAdmin: false };
	}
}

/**
 * Get all departments
 */
export async function getAllDepartments(): Promise<ActionResponse> {
	try {
		const result = await pool.query(
			"SELECT department_id, name FROM Department ORDER BY name ASC"
		);

		return {
			success: true,
			data: result.rows,
		};
	} catch (error) {
		console.error("Get departments error:", error);
		return { error: "Failed to fetch departments" };
	}
}
