-- Add user status and approval tracking to Better Auth user table
-- This enables pending approval workflow for self-registered users

-- Add status column with constraint and default value
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' 
CHECK (status IN ('active', 'pending', 'rejected'));

-- Add approved_by column to track which admin approved the user
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS approved_by TEXT;

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_user_status ON "user"(status);

-- CRITICAL: Set ALL existing users to active (backward compatibility)
-- This ensures existing users can still log in
UPDATE "user" SET status = 'active' WHERE status IS NULL OR status = '';

-- Set default for the column to ensure new rows get 'active' by default
-- (registration will override this to 'pending')
ALTER TABLE "user" ALTER COLUMN status SET DEFAULT 'active';

-- Add comment for documentation
COMMENT ON COLUMN "user".status IS 'User account status: active (can login), pending (awaiting approval), rejected (denied access)';
COMMENT ON COLUMN "user".approved_by IS 'User ID of the admin who approved this account';
