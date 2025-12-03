-- Rollback Migration: Remove Document Features and Password Reset
-- Run this script to rollback the add_document_features.sql migration

-- Drop indexes
DROP INDEX IF EXISTS idx_password_reset_expires;
DROP INDEX IF EXISTS idx_password_reset_user;
DROP INDEX IF EXISTS idx_password_reset_token;
DROP INDEX IF EXISTS idx_documents_status;
DROP INDEX IF EXISTS idx_documents_views;

-- Drop PasswordResetTokens table
DROP TABLE IF EXISTS PasswordResetTokens;

-- Remove status column from Documents table
ALTER TABLE Documents 
DROP COLUMN IF EXISTS status;

-- Remove views column from Documents table
ALTER TABLE Documents 
DROP COLUMN IF EXISTS views;

-- Display rollback success message
DO $$
BEGIN
    RAISE NOTICE 'Rollback completed successfully!';
    RAISE NOTICE 'Removed columns: Documents.views, Documents.status';
    RAISE NOTICE 'Dropped table: PasswordResetTokens';
    RAISE NOTICE 'Removed all related indexes';
END $$;
