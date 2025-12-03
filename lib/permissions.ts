import pool from "@/lib/db";

export interface PermissionCheck {
  hasPermission: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  error?: string;
}

/**
 * Check if user has permission to modify/delete a document
 * Combines document ownership check and user role check in a single query
 */
export async function checkDocumentPermission(
  documentId: string,
  userId: string
): Promise<PermissionCheck> {
  try {
    const result = await pool.query(
      `SELECT 
        d.uploaded_by,
        u.role
      FROM Documents d
      CROSS JOIN Users u
      WHERE d.document_id = $1 AND u.user_id = $2`,
      [documentId, userId]
    );

    if (result.rows.length === 0) {
      return {
        hasPermission: false,
        isOwner: false,
        isAdmin: false,
        error: "Document not found",
      };
    }

    const { uploaded_by, role } = result.rows[0];
    const isOwner = uploaded_by === parseInt(userId);
    const isAdmin = role === "admin";

    return {
      hasPermission: isOwner || isAdmin,
      isOwner,
      isAdmin,
    };
  } catch (error) {
    console.error("Permission check error:", error);
    return {
      hasPermission: false,
      isOwner: false,
      isAdmin: false,
      error: "Failed to check permissions",
    };
  }
}

/**
 * Get or create a category by name
 * Returns the category ID
 */
export async function getOrCreateCategory(
  categoryName: string,
  userId: string
): Promise<number | null> {
  if (!categoryName) return null;

  try {
    // Try to find existing category
    const existing = await pool.query(
      "SELECT category_id FROM Categories WHERE name = $1",
      [categoryName]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0].category_id;
    }

    // Create new category
    const newCategory = await pool.query(
      "INSERT INTO Categories (name, created_by) VALUES ($1, $2) RETURNING category_id",
      [categoryName, userId]
    );

    return newCategory.rows[0].category_id;
  } catch (error) {
    console.error("Category handling error:", error);
    return null;
  }
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagsString?: string): string[] {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const result = await pool.query(
      "SELECT role FROM Users WHERE user_id = $1",
      [userId]
    );
    return result.rows.length > 0 && result.rows[0].role === "admin";
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

/**
 * Check if user can delete documents (admin only)
 */
export async function canDeleteDocument(userId: string): Promise<boolean> {
  return isAdmin(userId);
}

/**
 * Check if user can assign users (admin only)
 */
export async function canAssignUsers(userId: string): Promise<boolean> {
  return isAdmin(userId);
}

/**
 * Check if user can approve documents (admin only)
 */
export async function canApproveDocuments(userId: string): Promise<boolean> {
  return isAdmin(userId);
}
