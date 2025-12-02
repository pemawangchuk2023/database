import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/models/document";

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`,
        };
    }

    // Check file type
    const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: "File type not allowed. Supported: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, GIF",
        };
    }

    return { valid: true };
}

/**
 * Convert File to Buffer for database storage
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
    const bytes = await file.arrayBuffer();
    return Buffer.from(bytes);
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
