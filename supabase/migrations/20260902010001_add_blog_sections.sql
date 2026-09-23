-- Migration: Add sections JSONB column to blogs table

ALTER TABLE blogs 
ADD COLUMN sections JSONB DEFAULT '[]'::jsonb;
