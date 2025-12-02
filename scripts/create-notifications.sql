-- Create Notifications table
CREATE TABLE IF NOT EXISTS Notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'system', -- 'document', 'user', 'system'
  read BOOLEAN DEFAULT FALSE,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON Notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON Notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON Notifications(created_at DESC);

-- Insert some sample notifications for testing
INSERT INTO Notifications (user_id, title, message, type, link) 
SELECT 
  user_id,
  'Welcome to DocuVault',
  'Your account has been created successfully. Start by uploading your first document.',
  'system',
  '/documents/upload'
FROM Users
WHERE NOT EXISTS (SELECT 1 FROM Notifications LIMIT 1);
