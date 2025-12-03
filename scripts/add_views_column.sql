-- Add views column to Documents table
ALTER TABLE Documents 
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Add status column if it doesn't exist (for document approval workflow)
ALTER TABLE Documents 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add approval tracking columns if they don't exist
ALTER TABLE Documents 
ADD COLUMN IF NOT EXISTS approved_by INT REFERENCES Users(user_id) ON DELETE SET NULL;

ALTER TABLE Documents 
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP;

-- Create index for views column
CREATE INDEX IF NOT EXISTS idx_documents_views ON Documents(views DESC);

-- Create index for status column
CREATE INDEX IF NOT EXISTS idx_documents_status ON Documents(status);
