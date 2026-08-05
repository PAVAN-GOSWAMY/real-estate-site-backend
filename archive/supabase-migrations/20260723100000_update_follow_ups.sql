-- Add new columns for priority and completed_at
ALTER TABLE lead_follow_ups 
ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Migrate existing 'Pending' status to 'Scheduled'
UPDATE lead_follow_ups 
SET status = 'Scheduled' 
WHERE status = 'Pending';
