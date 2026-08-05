-- Migration to add rera_number to properties table
ALTER TABLE "public"."properties" 
ADD COLUMN IF NOT EXISTS "rera_number" text;
