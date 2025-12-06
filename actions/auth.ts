"use server";

import { auth } from "@/lib/auth";
import { parseError } from "@/lib/errors";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
    error?: string;
    success?: boolean;
    data?: unknown;
};

/**
 * Request password reset using Better Auth
 */
export async function requestPasswordReset(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        const email = formData.get("email") as string;

        if (!email || !email.includes("@")) {
            return { error: "Invalid email address" };
        }

        const pool = (await import("@/lib/db")).default;

        // Check if user exists
        const userCheck = await pool.query(
            `SELECT id FROM "user" WHERE email = $1`,
            [email]
        );

        if (userCheck.rows.length === 0) {
            // Return success even if user not found to prevent enumeration
            return {
                success: true,
                data: {
                    message: "If an account exists with this email, you will receive a password reset link."
                }
            };
        }

        // Generate token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store in verification table
        await pool.query(
            `INSERT INTO "verification" (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, NOW(), NOW())`,
            [crypto.randomUUID(), email, token, expiresAt]
        );

        const resetLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;
        
        return {
            success: true,
            data: { resetLink }
        };
    } catch (error) {
        console.error("Request password reset error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

/**
 * Reset password using Better Auth
 */
export async function resetPassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        const token = formData.get("token") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!password || password.length < 8) {
            return { error: "Password must be at least 8 characters" };
        }

        if (password !== confirmPassword) {
            return { error: "Passwords do not match" };
        }

        const pool = (await import("@/lib/db")).default;

        // Verify token
        const tokenCheck = await pool.query(
            `SELECT * FROM "verification" WHERE value = $1 AND "expiresAt" > NOW()`,
            [token]
        );

        if (tokenCheck.rows.length === 0) {
            return { error: "Invalid or expired token" };
        }

        const email = tokenCheck.rows[0].identifier;

        // Get user ID
        const userCheck = await pool.query(
            `SELECT id FROM "user" WHERE email = $1`,
            [email]
        );

        if (userCheck.rows.length === 0) {
            return { error: "User not found" };
        }

        const userId = userCheck.rows[0].id;

        // Import Better Auth's crypto module to hash password correctly
        const { hashPassword } = await import("better-auth/crypto");
        const hashedPassword = await hashPassword(password);

        // Update password in account table
        await pool.query(
            `UPDATE "account" 
             SET password = $1, "updatedAt" = NOW()
             WHERE "userId" = $2 AND "providerId" = 'credential'`,
            [hashedPassword, userId]
        );

        // Delete used token
        await pool.query(
            `DELETE FROM "verification" WHERE value = $1`,
            [token]
        );

        return { success: true };
    } catch (error) {
        console.error("Reset password error:", error);
        return { error: "Failed to reset password. The link may have expired." };
    }
}

/**
 * Validate reset token
 */
export async function validateResetToken(token: string): Promise<{ valid: boolean; error?: string }> {
    try {
        const pool = (await import("@/lib/db")).default;
        const result = await pool.query(
            `SELECT * FROM "verification" WHERE value = $1 AND "expiresAt" > NOW()`,
            [token]
        );

        if (result.rows.length === 0) {
            return { valid: false, error: "Invalid or expired token" };
        }

        return { valid: true };
    } catch (error) {
        console.error("Validate token error:", error);
        return { valid: false, error: "Failed to validate token" };
    }
}

/**
 * Register a new user using Better Auth
 */
export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const department = formData.get("department") as string;

        // Basic validation
        if (!name || name.length < 2) {
            return { error: "Name must be at least 2 characters" };
        }
        if (!email || !email.includes("@")) {
            return { error: "Invalid email address" };
        }
        if (!password || password.length < 8) {
            return { error: "Password must be at least 8 characters" };
        }
        if (!department) {
            return { error: "Department is required" };
        }

        // Use Better Auth server-side API to create user
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
        });

        // Better Auth returns user object directly on success
        if (!result || !result.user) {
            return { error: "Failed to create account" };
        }

        // Update the user with custom fields (role, department, and status)
        const pool = (await import("@/lib/db")).default;
        await pool.query(
            `UPDATE "user" SET role = $1, department = $2, status = $3 WHERE id = $4`,
            ["staff", department, "pending", result.user.id]
        );

        // Sign out the user immediately (they shouldn't be logged in until approved)
        await auth.api.signOut({
            headers: await headers(),
        });

        return { success: true };
    } catch (error) {
        const message = parseError(error);
        console.error("Registration error:", error);

        if (message.includes("already exists") || message.includes("unique") || message.includes("duplicate")) {
            return { error: "User already exists with this email" };
        }

        return { error: message || "Something went wrong. Please try again." };
    }
}

/**
 * Login user using Better Auth
 */
export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        // First, check user status BEFORE attempting login
        const pool = (await import("@/lib/db")).default;
        const userCheck = await pool.query(
            `SELECT id, email, status FROM "user" WHERE email = $1`,
            [email]
        );

        if (userCheck.rows.length === 0) {
            return { error: "Invalid email or password" };
        }

        const user = userCheck.rows[0];

        // Check user status BEFORE attempting Better Auth login
        if (user.status === "pending") {
            return { error: "Your account is pending admin approval. Please wait for an administrator to approve your registration." };
        }

        if (user.status === "rejected") {
            return { error: "Your account has been rejected. Please contact an administrator for more information." };
        }

        if (user.status !== "active") {
            return { error: "Your account is not active. Please contact an administrator." };
        }

        // User is active, now let Better Auth handle password verification and session creation
        const result = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        if (!result) {
            return { error: "Invalid email or password" };
        }

        return { success: true };
    } catch (error) {
        console.error("Login error:", error);
        return { error: parseError(error) };
    }
}

/**
 * Logout user using Better Auth
 */
export async function logout() {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
    redirect("/auth/login");
}

/**
 * Get current session using Better Auth
 */
export async function getSession() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return null;
        }

        // Return session in format compatible with existing code
        return {
            userId: session.user.id,
            role: session.user.role || "staff",
            user: session.user,
        };
    } catch (error) {
        console.error("Get session error:", error);
        return null;
    }
}

/**
 * Get all pending users awaiting approval (Admin only)
 */
export async function getPendingUsers(): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        // Check if user is admin
        const pool = (await import("@/lib/db")).default;
        const adminCheck = await pool.query(
            `SELECT role FROM "user" WHERE id = $1`,
            [session.userId]
        );

        if (!adminCheck.rows[0] || adminCheck.rows[0].role !== "admin") {
            return { error: "Only administrators can view pending users" };
        }

        // Get all pending users
        const result = await pool.query(
            `SELECT id, name, email, role, department, "createdAt" 
             FROM "user" 
             WHERE status = 'pending' 
             ORDER BY "createdAt" DESC`
        );

        return {
            success: true,
            data: result.rows,
        };
    } catch (error) {
        console.error("Get pending users error:", error);
        return { error: parseError(error) };
    }
}

/**
 * Approve a pending user (Admin only)
 */
export async function approveUser(userId: string): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        // Check if user is admin
        const pool = (await import("@/lib/db")).default;
        const adminCheck = await pool.query(
            `SELECT role FROM "user" WHERE id = $1`,
            [session.userId]
        );

        if (!adminCheck.rows[0] || adminCheck.rows[0].role !== "admin") {
            return { error: "Only administrators can approve users" };
        }

        // Update user status to active
        const result = await pool.query(
            `UPDATE "user" 
             SET status = 'active', approved_by = $1, "updatedAt" = CURRENT_TIMESTAMP 
             WHERE id = $2 AND status = 'pending'
             RETURNING id, name, email`,
            [session.userId, userId]
        );

        if (result.rows.length === 0) {
            return { error: "User not found or already processed" };
        }

        console.log(`✅ User approved: ${result.rows[0].email} by admin ${session.userId}`);

        return {
            success: true,
            data: result.rows[0],
        };
    } catch (error) {
        console.error("Approve user error:", error);
        return { error: parseError(error) };
    }
}

/**
 * Reject a pending user (Admin only)
 */
export async function rejectUser(userId: string): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        // Check if user is admin
        const pool = (await import("@/lib/db")).default;
        const adminCheck = await pool.query(
            `SELECT role FROM "user" WHERE id = $1`,
            [session.userId]
        );

        if (!adminCheck.rows[0] || adminCheck.rows[0].role !== "admin") {
            return { error: "Only administrators can reject users" };
        }

        // Update user status to rejected
        const result = await pool.query(
            `UPDATE "user" 
             SET status = 'rejected', "updatedAt" = CURRENT_TIMESTAMP 
             WHERE id = $1 AND status = 'pending'
             RETURNING id, name, email`,
            [userId]
        );

        if (result.rows.length === 0) {
            return { error: "User not found or already processed" };
        }

        console.log(`❌ User rejected: ${result.rows[0].email} by admin ${session.userId}`);

        return {
            success: true,
            data: result.rows[0],
        };
    } catch (error) {
        console.error("Reject user error:", error);
        return { error: parseError(error) };
    }
}

type ActionResponse = {
    success?: boolean;
    error?: string;
    data?: unknown;
};
