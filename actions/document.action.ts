"use server";

import { z } from "zod";
import pool from "@/lib/db";
import { getSession } from "@/actions/auth";
import { revalidatePath } from "next/cache";
import { documentUploadSchema, documentUpdateSchema } from "@/models/document";
import { validateFile, formatFileSize } from "@/lib/file-upload";
import {
	checkDocumentPermission,
	getOrCreateCategory,
	parseTags,
	isAdmin,
	canDeleteDocument,
} from "@/lib/permissions";

export type ActionResponse = {
	success?: boolean;
	error?: string;
	data?: any;
};

/**
 * Upload a new document
 */
export async function uploadDocument(
	formData: FormData
): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized. Please log in." };
		}

		// Validate form data
		const data = {
			title: formData.get("title"),
			description: formData.get("description") || "",
			type: formData.get("documentType"),
			category: formData.get("category") || "",
			tags: formData.get("tags") || "",
			accessLevel: formData.get("accessLevel") || "internal",
		};

		const validated = documentUploadSchema.parse(data);

		// Validate file
		const file = formData.get("file") as File;
		if (!file || file.size === 0) {
			return { error: "No file provided" };
		}

		const fileValidation = validateFile(file);
		if (!fileValidation.valid) {
			return { error: fileValidation.error };
		}

		// Convert file to buffer
		const fileBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(fileBuffer);

		// Handle category and tags
		const categoryId = validated.category
			? await getOrCreateCategory(validated.category, session.userId)
			: null;
		const tagsArray = parseTags(validated.tags);

		// Check if user is admin to determine document status
		const userIsAdmin = await isAdmin(session.userId);
		const documentStatus = userIsAdmin ? "approved" : "pending";

		// Insert document
		const result = await pool.query(
			`INSERT INTO Documents 
        (title, description, file_name, file_size, file_type, file_data, 
         category_id, type, access_level, tags, uploaded_by, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING document_id`,
			[
				validated.title,
				validated.description || null,
				file.name,
				file.size,
				file.type,
				buffer,
				categoryId,
				validated.type,
				validated.accessLevel,
				tagsArray,
				session.userId,
				documentStatus,
			]
		);

		const documentId = result.rows[0].document_id;

		// Log the activity
		await pool.query(
			"INSERT INTO ActivityLogs (user_id, action, details) VALUES ($1, $2, $3)",
			[
				session.userId,
				"DOCUMENT_UPLOAD",
				`Uploaded document: ${validated.title}`,
			]
		);

		revalidatePath("/documents");
		revalidatePath("/dashboard");

		return {
			success: true,
			data: { documentId },
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Upload error:", error);
		return { error: "Failed to upload document. Please try again." };
	}
}

/**
 * Get all documents with optional filtering
 */
export async function getDocuments(filters?: {
	search?: string;
	type?: string;
	accessLevel?: string;
	category?: string;
	limit?: number;
	offset?: number;
}): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Build query with filters
		const conditions: string[] = [];
		const params: any[] = [];

		// Staff users only see approved documents
		const userIsAdmin = await isAdmin(session.userId);
		if (!userIsAdmin) {
			conditions.push(`d.status = 'approved'`);
		}

		if (filters?.search) {
			params.push(`%${filters.search}%`);
			conditions.push(
				`(d.title ILIKE $${params.length} OR d.description ILIKE $${params.length})`
			);
		}

		if (filters?.type) {
			params.push(filters.type);
			conditions.push(`d.type = $${params.length}`);
		}

		if (filters?.accessLevel) {
			params.push(filters.accessLevel);
			conditions.push(`d.access_level = $${params.length}`);
		}

		if (filters?.category) {
			params.push(filters.category);
			conditions.push(`c.name = $${params.length}`);
		}

		const whereClause =
			conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		// Build pagination
		let limitClause = "";
		if (filters?.limit) {
			params.push(filters.limit);
			limitClause = `LIMIT $${params.length}`;
		}

		let offsetClause = "";
		if (filters?.offset) {
			params.push(filters.offset);
			offsetClause = `OFFSET $${params.length}`;
		}

		const query = `
      SELECT 
        d.document_id,
        d.title,
        d.description,
        d.file_name,
        d.file_size,
        d.file_type,
        d.category_id,
        d.type,
        d.access_level,
        d.tags,
        d.uploaded_by,
        d.downloads,
        d.views,
        d.created_at,
        d.updated_at,
        d.status,
        d.approved_by,
        d.approval_date,
        u.name as uploader_name,
        u.email as uploader_email,
        c.name as category_name
      FROM Documents d
      LEFT JOIN Users u ON d.uploaded_by = u.user_id
      LEFT JOIN Categories c ON d.category_id = c.category_id
      ${whereClause}
      ORDER BY d.created_at DESC
      ${limitClause}
      ${offsetClause}
    `;

		const result = await pool.query(query, params);

		return {
			success: true,
			data: result.rows,
		};
	} catch (error) {
		console.error("Get documents error:", error);
		return { error: "Failed to fetch documents" };
	}
}

/**
 * Update a document
 */
export async function updateDocument(
	id: string,
	formData: FormData
): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check permissions
		const permission = await checkDocumentPermission(id, session.userId);
		if (permission.error) {
			return { error: permission.error };
		}
		if (!permission.hasPermission) {
			return { error: "You don't have permission to edit this document" };
		}

		// Validate form data
		const data = {
			title: formData.get("title"),
			description: formData.get("description"),
			type: formData.get("documentType"),
			category: formData.get("category"),
			tags: formData.get("tags"),
			accessLevel: formData.get("accessLevel"),
		};

		const validated = documentUpdateSchema.parse(data);

		// Build update query
		const updates: string[] = [];
		const params: any[] = [];

		if (validated.title) {
			params.push(validated.title);
			updates.push(`title = $${params.length}`);
		}

		if (validated.description !== undefined) {
			params.push(validated.description || null);
			updates.push(`description = $${params.length}`);
		}

		if (validated.type) {
			params.push(validated.type);
			updates.push(`type = $${params.length}`);
		}

		if (validated.accessLevel) {
			params.push(validated.accessLevel);
			updates.push(`access_level = $${params.length}`);
		}

		if (validated.tags !== undefined) {
			const tagsArray = parseTags(validated.tags);
			params.push(tagsArray);
			updates.push(`tags = $${params.length}`);
		}

		if (validated.category) {
			const categoryId = await getOrCreateCategory(
				validated.category,
				session.userId
			);
			params.push(categoryId);
			updates.push(`category_id = $${params.length}`);
		}

		if (updates.length === 0) {
			return { error: "No fields to update" };
		}

		params.push(id);
		const query = `
      UPDATE Documents 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE document_id = $${params.length}
    `;

		await pool.query(query, params);

		// Log the activity
		await pool.query(
			"INSERT INTO ActivityLogs (user_id, action, details) VALUES ($1, $2, $3)",
			[session.userId, "DOCUMENT_UPDATE", `Updated document ID: ${id}`]
		);

		revalidatePath("/documents");
		revalidatePath(`/documents/${id}`);

		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: error.errors[0].message };
		}
		console.error("Update document error:", error);
		return { error: "Failed to update document" };
	}
}

/**
 * Delete a document (admin only)
 */
export async function deleteDocument(id: string): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userCanDelete = await canDeleteDocument(session.userId);
		if (!userCanDelete) {
			return { error: "Only administrators can delete documents" };
		}

		// Get document title before deletion for logging
		const docResult = await pool.query(
			"SELECT title FROM Documents WHERE document_id = $1",
			[id]
		);
		const docTitle = docResult.rows[0]?.title || "Unknown";

		await pool.query("DELETE FROM Documents WHERE document_id = $1", [id]);

		// Log the activity
		await pool.query(
			"INSERT INTO ActivityLogs (user_id, action, details) VALUES ($1, $2, $3)",
			[session.userId, "DOCUMENT_DELETE", `Deleted document: ${docTitle}`]
		);

		revalidatePath("/documents");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Delete document error:", error);
		return { error: "Failed to delete document" };
	}
}

/**
 * Increment download count
 */
export async function incrementDownloadCount(
	id: string
): Promise<ActionResponse> {
	try {
		await pool.query(
			"UPDATE Documents SET downloads = downloads + 1 WHERE document_id = $1",
			[id]
		);
		return { success: true };
	} catch (error) {
		console.error("Increment download error:", error);
		return { error: "Failed to update download count" };
	}
}

/**
 * Increment view count
 */
export async function incrementViewCount(id: string): Promise<ActionResponse> {
	try {
		await pool.query(
			"UPDATE Documents SET views = views + 1 WHERE document_id = $1",
			[id]
		);

		return { success: true };
	} catch (error) {
		console.error("Increment view error:", error);
		return { error: "Failed to update view count" };
	}
}

/**
 * Get document statistics for dashboard
 */
export async function getDocumentStats(): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		const result = await pool.query(`
      SELECT 
        COUNT(*) as total_documents,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as documents_this_month,
        COALESCE(SUM(file_size), 0) as total_storage
      FROM Documents
    `);

		const typeResult = await pool.query(`
      SELECT type, COUNT(*) as count 
      FROM Documents 
      GROUP BY type 
      ORDER BY count DESC
    `);

		const stats = result.rows[0];

		return {
			success: true,
			data: {
				totalDocuments: parseInt(stats.total_documents),
				documentsThisMonth: parseInt(stats.documents_this_month),
				totalStorage: parseInt(stats.total_storage),
				totalSize: formatFileSize(parseInt(stats.total_storage)),
				documentsByType: typeResult.rows,
			},
		};
	} catch (error) {
		console.error("Get stats error:", error);
		return { error: "Failed to fetch statistics" };
	}
}

/**
 * Download document file
 */
export async function downloadDocument(id: string): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		const result = await pool.query(
			"SELECT file_name, file_type, file_data FROM Documents WHERE document_id = $1",
			[id]
		);

		if (result.rows.length === 0) {
			return { error: "Document not found" };
		}

		await incrementDownloadCount(id);

		// Log the activity
		await pool.query(
			"INSERT INTO ActivityLogs (user_id, action, details) VALUES ($1, $2, $3)",
			[
				session.userId,
				"DOCUMENT_DOWNLOAD",
				`Downloaded: ${result.rows[0].file_name}`,
			]
		);

		return {
			success: true,
			data: {
				fileName: result.rows[0].file_name,
				fileType: result.rows[0].file_type,
				fileData: result.rows[0].file_data,
			},
		};
	} catch (error) {
		console.error("Download document error:", error);
		return { error: "Failed to download document" };
	}
}

/**
 * Get recent documents
 */
export async function getRecentDocuments(
	limit: number = 5
): Promise<ActionResponse> {
	return getDocuments({ limit, offset: 0 });
}

/**
 * Get a single document by ID
 */
export async function getDocumentById(id: string): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		const result = await pool.query(
			`SELECT 
        d.*,
        u.name as uploader_name,
        u.email as uploader_email,
        c.name as category_name
      FROM Documents d
      LEFT JOIN Users u ON d.uploaded_by = u.user_id
      LEFT JOIN Categories c ON d.category_id = c.category_id
      WHERE d.document_id = $1`,
			[id]
		);

		if (result.rows.length === 0) {
			return { error: "Document not found" };
		}

		// Increment view count
		await incrementViewCount(id);

		return {
			success: true,
			data: result.rows[0],
		};
	} catch (error) {
		console.error("Get document error:", error);
		return { error: "Failed to fetch document" };
	}
}

/**
 * Get pending documents (admin only)
 */
export async function getPendingDocuments(): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userIsAdmin = await isAdmin(session.userId);
		if (!userIsAdmin) {
			return { error: "Only administrators can view pending documents" };
		}

		const result = await pool.query(`
			SELECT 
				d.document_id,
				d.title,
				d.description,
				d.file_name,
				d.file_size,
				d.file_type,
				d.category_id,
				d.type,
				d.access_level,
				d.tags,
				d.uploaded_by,
				d.downloads,
				d.created_at,
				d.updated_at,
				d.status,
				d.approved_by,
				d.approval_date,
				u.name as uploader_name,
				u.email as uploader_email,
				c.name as category_name
			FROM Documents d
			LEFT JOIN Users u ON d.uploaded_by = u.user_id
			LEFT JOIN Categories c ON d.category_id = c.category_id
			WHERE d.status = 'pending' OR d.status IS NULL
			ORDER BY d.created_at DESC
		`);

		return {
			success: true,
			data: result.rows,
		};
	} catch (error) {
		console.error("Get pending documents error:", error);
		return { error: "Failed to fetch pending documents" };
	}
}

/**
 * Approve a pending document (admin only)
 */
export async function approveDocument(
	documentId: string
): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userIsAdmin = await isAdmin(session.userId);
		if (!userIsAdmin) {
			return { error: "Only administrators can approve documents" };
		}

		// Update document status
		await pool.query(
			`UPDATE Documents 
       SET status = 'approved', 
           approved_by = $1, 
           approval_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE document_id = $2`,
			[session.userId, documentId]
		);

		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Approve document error:", error);
		return { error: "Failed to approve document" };
	}
}

/**
 * Reject a pending document (admin only)
 */
export async function rejectDocument(
	documentId: string,
	_reason?: string
): Promise<ActionResponse> {
	try {
		const session = await getSession();
		if (!session) {
			return { error: "Unauthorized" };
		}

		// Check if user is admin
		const userIsAdmin = await isAdmin(session.userId);
		if (!userIsAdmin) {
			return { error: "Only administrators can reject documents" };
		}

		// Update document status
		await pool.query(
			`UPDATE Documents 
       SET status = 'rejected', 
           approved_by = $1, 
           approval_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE document_id = $2`,
			[session.userId, documentId]
		);

		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Reject document error:", error);
		return { error: "Failed to reject document" };
	}
}
