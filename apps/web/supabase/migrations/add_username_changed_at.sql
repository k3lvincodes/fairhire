-- Add username_changed_at column to track when username was last changed
-- Username can only be changed once per month
ALTER TABLE users ADD COLUMN IF NOT EXISTS username_changed_at timestamptz;
