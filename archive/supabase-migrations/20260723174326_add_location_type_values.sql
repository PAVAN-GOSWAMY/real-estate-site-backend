-- Add new values to location_type enum

ALTER TYPE "public"."location_type" ADD VALUE IF NOT EXISTS 'INDUSTRIAL_AREA';
ALTER TYPE "public"."location_type" ADD VALUE IF NOT EXISTS 'TECH_PARK';
ALTER TYPE "public"."location_type" ADD VALUE IF NOT EXISTS 'COMMERCIAL_HUB';
