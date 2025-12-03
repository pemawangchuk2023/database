"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import crypto from "crypto";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    department: z.string().min(1, "Department is required"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type AuthState = {
    error?: string;
    success?: boolean;
};

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        const data = Object.fromEntries(formData.entries());
        const validated = registerSchema.parse(data);

        // Check if user already exists
        const existingUser = await pool.query(
            "SELECT user_id FROM Users WHERE email = $1",
            [validated.email]
        );

        if (existingUser.rows.length > 0) {
            return { error: "User already exists with this email" };
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Get or create department
        let departmentResult = await pool.query(
            "SELECT department_id FROM Department WHERE name = $1",
            [validated.department]
        );

        let departmentId;
        if (departmentResult.rows.length === 0) {
            const newDept = await pool.query(
                "INSERT INTO Department (name) VALUES ($1) RETURNING department_id",
                [validated.department]
            );
            departmentId = newDept.rows[0].department_id;
        } else {
            departmentId = departmentResult.rows[0].department_id;
        }

        // Create new user
        const result = await pool.query(
            "INSERT INTO Users (name, email, password, department_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, role",
            [validated.name, validated.email, hashedPassword, departmentId, "staff"]
        );

        const user = result.rows[0];

        await createSession(user.user_id.toString(), user.role);

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Registration error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        const data = Object.fromEntries(formData.entries());
        const validated = loginSchema.parse(data);

        // Find user by email
        const result = await pool.query(
            "SELECT user_id, password, role FROM Users WHERE email = $1",
            [validated.email]
        );

        if (result.rows.length === 0) {
            return { error: "Invalid email or password" };
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(validated.password, user.password);

        if (!isPasswordValid) {
            return { error: "Invalid email or password" };
        }

        await createSession(user.user_id.toString(), user.role);
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Login error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function logout() {
    await deleteSession();
    redirect("/auth/login");
}

// Password Reset Schemas
const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

/**
 * Request password reset - generates token and sends email
 */
export async function requestPasswordReset(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    try {
        const data = Object.fromEntries(formData.entries());
        const validated = forgotPasswordSchema.parse(data);

        // Check if user exists
        const userResult = await pool.query(
            "SELECT user_id, role FROM Users WHERE email = $1",
            [validated.email]
        );

        // Always return success to prevent email enumeration
        if (userResult.rows.length === 0) {
            return {
                success: true,
                error: undefined,
            };
        }

        const user = userResult.rows[0];

        // Check if user is admin or staff
        if (user.role !== "admin" && user.role !== "staff") {
            return {
                error: "Only admin and staff users can reset passwords.",
            };
        }

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token expires in 1 hour
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Delete any existing tokens for this user
        await pool.query(
            "DELETE FROM PasswordResetTokens WHERE user_id = $1",
            [user.user_id]
        );

        // Store hashed token in database
        await pool.query(
            "INSERT INTO PasswordResetTokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
            [user.user_id, hashedToken, expiresAt]
        );

        // TODO: Send email with reset link
        // For now, log the reset link to console
        const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
        console.log("\n=== PASSWORD RESET LINK ===");
        console.log(`User: ${user.email}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log(`Expires: ${expiresAt.toLocaleString()}`);
        console.log("===========================\n");

        // In production, you would send an email here:
        // await sendPasswordResetEmail(user.email, user.name, resetLink);

        return {
            success: true,
            error: undefined,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Password reset request error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

/**
 * Validate reset token
 */
export async function validateResetToken(
    token: string
): Promise<{ valid: boolean; error?: string }> {
    try {
        if (!token) {
            return { valid: false, error: "Token is required" };
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const result = await pool.query(
            `SELECT token_id, user_id, expires_at, used 
       FROM PasswordResetTokens 
       WHERE token = $1`,
            [hashedToken]
        );

        if (result.rows.length === 0) {
            return { valid: false, error: "Invalid or expired reset link" };
        }

        const tokenData = result.rows[0];

        if (tokenData.used) {
            return { valid: false, error: "This reset link has already been used" };
        }

        if (new Date() > new Date(tokenData.expires_at)) {
            return { valid: false, error: "This reset link has expired" };
        }

        return { valid: true };
    } catch (error) {
        console.error("Token validation error:", error);
        return { valid: false, error: "Failed to validate token" };
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    try {
        const data = Object.fromEntries(formData.entries());
        const validated = resetPasswordSchema.parse(data);

        // Validate token
        const tokenValidation = await validateResetToken(validated.token);
        if (!tokenValidation.valid) {
            return { error: tokenValidation.error || "Invalid token" };
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(validated.token)
            .digest("hex");

        // Get user ID from token
        const tokenResult = await pool.query(
            "SELECT user_id FROM PasswordResetTokens WHERE token = $1",
            [hashedToken]
        );

        if (tokenResult.rows.length === 0) {
            return { error: "Invalid reset link" };
        }

        const userId = tokenResult.rows[0].user_id;

        // Hash new password
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Update user password
        await pool.query(
            "UPDATE Users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
            [hashedPassword, userId]
        );

        // Mark token as used
        await pool.query(
            "UPDATE PasswordResetTokens SET used = TRUE WHERE token = $1",
            [hashedToken]
        );

        // Delete all sessions for this user (force re-login)
        await pool.query("DELETE FROM Sessions WHERE user_id = $1", [userId]);

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Password reset error:", error);
        return { error: "Failed to reset password. Please try again." };
    }
}
