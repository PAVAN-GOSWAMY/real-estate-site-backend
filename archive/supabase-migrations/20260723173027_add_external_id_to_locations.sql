-- Migration to add external tracking fields to locations
ALTER TABLE "public"."locations" 
ADD COLUMN IF NOT EXISTS "external_id" text,
ADD COLUMN IF NOT EXISTS "provider" text;

CREATE INDEX IF NOT EXISTS "locations_external_id_provider_idx" ON "public"."locations" ("external_id", "provider");
