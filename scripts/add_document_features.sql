-- Database Migration: Add Document Features and Password Reset
-- Run this migration to add views tracking, approval status, and password reset functionality

-- Add views column to Documents table
ALTER TABLE Documents 
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Add status column to Documents table for approval workflow
ALTER TABLE Documents 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create PasswordResetTokens table
CREATE TABLE IF NOT EXISTS PasswordResetTokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_views ON Documents(views DESC);
CREATE INDEX IF NOT EXISTS idx_documents_status ON Documents(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON PasswordResetTokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON PasswordResetTokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON PasswordResetTokens(expires_at);

-- Update existing documents to have 'approved' status (for backward compatibility)
UPDATE Documents 
SET status = 'approved' 
WHERE status IS NULL;

-- Add comment to explain the status column
COMMENT ON COLUMN Documents.status IS 'Document approval status: pending (awaiting admin approval), approved (visible to all), rejected (not approved)';
COMMENT ON COLUMN Documents.views IS 'Number of times the document has been viewed';
COMMENT ON TABLE PasswordResetTokens IS 'Stores password reset tokens for secure password recovery';

-- Display migration success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Added columns: Documents.views, Documents.status';
    RAISE NOTICE 'Created table: PasswordResetTokens';
    RAISE NOTICE 'Created indexes for performance optimization';
END $$;
