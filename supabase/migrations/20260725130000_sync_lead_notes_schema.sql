-- Migration: Sync Lead Notes Schema
-- Description: Evolves lead_notes table to production schema

-- 1. Rename 'content' to 'note' to preserve existing data
ALTER TABLE lead_notes RENAME COLUMN content TO note;

-- 2. Add 'user_id' as UUID NULL
-- Note: Previously we had 'created_by_email'. The user explicitly requests user_id UUID NULL.
ALTER TABLE lead_notes ADD COLUMN user_id UUID NULL;

-- 3. Add 'priority' with default 'Medium'
ALTER TABLE lead_notes ADD COLUMN priority TEXT NOT NULL DEFAULT 'Medium';

-- 4. Add 'follow_up_date'
ALTER TABLE lead_notes ADD COLUMN follow_up_date TIMESTAMPTZ NULL;

-- 5. Drop 'created_by_email' as it's no longer in the application model
ALTER TABLE lead_notes DROP COLUMN created_by_email;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_notes_follow_up_date ON lead_notes(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_lead_notes_user_id ON lead_notes(user_id);
