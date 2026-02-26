-- Add settlement_type and min_score to tasks table for UI filtering
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS settlement_type text DEFAULT 'escrow';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS min_score int DEFAULT 0;

-- Optional: Create index if filtering by these fields becomes heavy
CREATE INDEX IF NOT EXISTS tasks_settlement_idx ON tasks(settlement_type);
CREATE INDEX IF NOT EXISTS tasks_min_score_idx ON tasks(min_score);
