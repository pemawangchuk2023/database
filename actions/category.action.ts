"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionResponse = {
    success?: boolean;
    error?: string;
    data?: any;
};

const categorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
    description: z.string().optional(),
});

/**
 * Get all categories
 */
export async function getCategories(): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        const result = await pool.query(`
      SELECT 
        category_id,
        name,
        description,
        created_by,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM Documents WHERE category_id = Categories.category_id) as document_count
      FROM Categories
      ORDER BY name ASC
    `);

        return {
            success: true,
            data: result.rows,
        };
    } catch (error) {
        console.error("Get categories error:", error);
        return { error: "Failed to fetch categories" };
    }
}

/**
 * Create a new category (admin only)
 */
export async function createCategory(formData: FormData): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        // Check if user is admin - only admins can create categories
        const userResult = await pool.query(
            "SELECT role FROM Users WHERE user_id = $1",
            [session.userId]
        );
        if (userResult.rows.length === 0 || userResult.rows[0].role !== "admin") {
            return { error: "Only administrators can create categories" };
        }

        const data = {
            name: formData.get("name"),
            description: formData.get("description") || "",
        };

        const validated = categorySchema.parse(data);

        // Check if category already exists
        const existing = await pool.query(
            "SELECT category_id FROM Categories WHERE LOWER(name) = LOWER($1)",
            [validated.name]
        );

        if (existing.rows.length > 0) {
            return { error: "Category already exists" };
        }

        const result = await pool.query(
            `INSERT INTO Categories (name, description, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING category_id`,
            [validated.name, validated.description || null, session.userId]
        );

        revalidatePath("/categories");

        return {
            success: true,
            data: { categoryId: result.rows[0].category_id },
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Create category error:", error);
        return { error: "Failed to create category" };
    }
}

/**
 * Update a category (admin only)
 */
export async function updateCategory(
    categoryId: string,
    formData: FormData
): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        // Check if user is admin - only admins can update categories
        const userResult = await pool.query(
            "SELECT role FROM Users WHERE user_id = $1",
            [session.userId]
        );
        if (userResult.rows.length === 0 || userResult.rows[0].role !== "admin") {
            return { error: "Only administrators can update categories" };
        }

        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
        };

        const validated = categorySchema.parse(data);

        // Check if another category has the same name
        const existing = await pool.query(
            "SELECT category_id FROM Categories WHERE LOWER(name) = LOWER($1) AND category_id != $2",
            [validated.name, categoryId]
        );

        if (existing.rows.length > 0) {
            return { error: "Another category with this name already exists" };
        }

        await pool.query(
            `UPDATE Categories 
       SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE category_id = $3`,
            [validated.name, validated.description || null, categoryId]
        );

        revalidatePath("/categories");

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        console.error("Update category error:", error);
        return { error: "Failed to update category" };
    }
}

/**
 * Delete a category (admin only)
 */
export async function deleteCategory(categoryId: string): Promise<ActionResponse> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: "Unauthorized" };
        }

        // Check if user is admin - only admins can delete categories
        const userResult = await pool.query(
            "SELECT role FROM Users WHERE user_id = $1",
            [session.userId]
        );
        if (userResult.rows.length === 0 || userResult.rows[0].role !== "admin") {
            return { error: "Only administrators can delete categories" };
        }

        // Check if category has documents
        const docCount = await pool.query(
            "SELECT COUNT(*) as count FROM Documents WHERE category_id = $1",
            [categoryId]
        );

        if (parseInt(docCount.rows[0].count) > 0) {
            return { error: "Cannot delete category with existing documents. Please reassign or delete the documents first." };
        }

        await pool.query("DELETE FROM Categories WHERE category_id = $1", [categoryId]);

        revalidatePath("/categories");

        return { success: true };
    } catch (error) {
        console.error("Delete category error:", error);
        return { error: "Failed to delete category" };
    }
}
