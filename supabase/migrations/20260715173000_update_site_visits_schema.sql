-- Phase 4.4 Update: Site Visits Schema Enhancement
-- To support Phase 7.5.8 lifecycle tracking

-- 1. Upgrade the site_visit_status ENUM
-- Note: Supabase supports running ADD VALUE outside transactions
ALTER TYPE site_visit_status ADD VALUE IF NOT EXISTS 'CONFIRMED' AFTER 'SCHEDULED';
ALTER TYPE site_visit_status ADD VALUE IF NOT EXISTS 'IN_PROGRESS' AFTER 'CONFIRMED';
ALTER TYPE site_visit_status ADD VALUE IF NOT EXISTS 'NO_SHOW' AFTER 'CANCELLED';

-- 2. Create the Site Visit Outcome ENUM
DO $$ BEGIN
    CREATE TYPE site_visit_outcome AS ENUM (
        'INTERESTED', 'NEEDS_FOLLOW_UP', 'NEGOTIATION_STARTED', 
        'BOOKED', 'NOT_INTERESTED', 'POSTPONED', 'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Alter site_visits table to support outcome
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS visit_outcome site_visit_outcome;
