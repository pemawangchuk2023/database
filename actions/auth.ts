"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

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
