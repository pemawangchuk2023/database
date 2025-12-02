import { z } from "zod";

// Database Document Interface (matches PostgreSQL schema)
export interface Document {
    document_id: number;
    title: string;
    description: string | null;
    file_name: string;
    file_size: number;
    file_type: string;
    file_data: Buffer;
    category_id: number | null;
    type: string;
    access_level: "public" | "internal" | "confidential";
    tags: string[] | null;
    uploaded_by: number;
    downloads: number;
    created_at: Date;
    updated_at: Date;
}

// Extended Document with User Info
export interface DocumentWithUser extends Document {
    uploader_name: string;
    uploader_email: string;
}

// Document Upload Schema
export const documentUploadSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long"),
    description: z.string().optional(),
    type: z.string().min(1, "Document type is required"),
    category: z.string().optional(),
    tags: z.string().optional(), // Comma-separated string
    accessLevel: z.enum(["public", "internal", "confidential"]).default("internal"),
});

// Document Update Schema
export const documentUpdateSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
    description: z.string().optional(),
    type: z.string().min(1, "Document type is required").optional(),
    category: z.string().optional(),
    tags: z.string().optional(),
    accessLevel: z.enum(["public", "internal", "confidential"]).optional(),
});

// File Validation Constants
export const ALLOWED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/gif': ['.gif'],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Type exports
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
