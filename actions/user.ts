"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export async function getUserProfile() {
    const session = await getSession();
    if (!session) return null;

    const result = await pool.query(
        `SELECT u.user_id, u.name, u.email, u.role, u.image, d.name as department_name 
         FROM Users u 
         LEFT JOIN Department d ON u.department_id = d.department_id 
         WHERE u.user_id = $1`,
        [session.userId]
    );

    return result.rows[0];
}

export async function updateUserProfile(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
    };

    try {
        const validated = profileSchema.parse(data);

        await pool.query(
            "UPDATE Users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3",
            [validated.name, validated.email, session.userId]
        );

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        return { error: "Failed to update profile" };
    }
}

export async function changePassword(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    const data = Object.fromEntries(formData.entries());

    try {
        const validated = passwordSchema.parse(data);

        // Verify current password
        const userResult = await pool.query("SELECT password FROM Users WHERE user_id = $1", [session.userId]);
        const user = userResult.rows[0];

        const isValid = await bcrypt.compare(validated.currentPassword, user.password);
        if (!isValid) {
            return { error: "Incorrect current password" };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

        await pool.query(
            "UPDATE Users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
            [hashedPassword, session.userId]
        );

        // Log the activity
        await pool.query(
            "INSERT INTO ActivityLogs (user_id, action, details) VALUES ($1, $2, $3)",
            [session.userId, "PASSWORD_CHANGE", "User changed their password"]
        );

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        return { error: "Failed to change password" };
    }
}

export async function getActivityLogs() {
    const session = await getSession();
    if (!session) return [];

    const result = await pool.query(
        "SELECT * FROM ActivityLogs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
        [session.userId]
    );

    return result.rows;
}
