-- =============================================================================
-- Migration: Update Leads RLS Policies
-- Description: Adds a public insert policy to lead_activities to allow the CRM 
--              pipeline to successfully log events on anonymous form submissions.
-- =============================================================================

-- Allow anonymous users to insert into lead_activities when submitting public forms
CREATE POLICY "Allow public insert on lead_activities" ON lead_activities FOR INSERT TO anon WITH CHECK (true);
