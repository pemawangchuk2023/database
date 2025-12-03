-- Remove Manager Role Migration
-- This script removes the manager role and updates all manager users to staff

-- Update all users with manager role to staff
UPDATE Users 
SET role = 'staff' 
WHERE role = 'manager';

-- Update the CHECK constraint to remove manager role
ALTER TABLE Users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE Users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'staff'));

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Manager role removed successfully!';
    RAISE NOTICE 'All manager users have been converted to staff';
    RAISE NOTICE 'Role constraint updated to allow only admin and staff';
END $$;
