-- ============================================================================
-- Master Data Seed
-- ============================================================================
-- This file contains idempotent inserts for master lookup data.
-- Run automatically by `supabase db reset` or manually via `supabase db seed`.
-- ============================================================================

-- 1. Cities
INSERT INTO "public"."cities" ("name", "slug", "state", "country", "is_active") VALUES
    ('Noida', 'noida', 'Uttar Pradesh', 'India', true),
    ('Greater Noida', 'greater-noida', 'Uttar Pradesh', 'India', true),
    ('Ghaziabad', 'ghaziabad', 'Uttar Pradesh', 'India', true),
    ('Delhi', 'delhi', 'Delhi', 'India', true),
    ('Gurugram', 'gurugram', 'Haryana', 'India', true),
    ('Faridabad', 'faridabad', 'Haryana', 'India', true)
ON CONFLICT ("name", "state") DO NOTHING;

-- 2. Amenities
INSERT INTO "public"."amenities" ("name", "category", "icon", "description", "is_active") VALUES
    -- Security
    ('24x7 Security', 'Security', 'Shield', 'Round-the-clock security personnel and systems.', true),
    ('CCTV Surveillance', 'Security', 'Camera', 'Comprehensive camera coverage for safety.', true),
    ('Gated Community', 'Security', 'Lock', 'Restricted access for enhanced security.', true),
    ('Intercom', 'Security', 'Phone', 'Direct communication lines to security and other units.', true),
    
    -- Recreation
    ('Swimming Pool', 'Recreation', 'Waves', 'Large outdoor or indoor pool for residents.', true),
    ('Gymnasium', 'Recreation', 'Dumbbell', 'Fully equipped modern fitness center.', true),
    ('Club House', 'Recreation', 'Home', 'Exclusive clubhouse with indoor facilities.', true),
    ('Indoor Games', 'Recreation', 'Gamepad', 'Dedicated area for table tennis, pool, etc.', true),
    ('Outdoor Sports Area', 'Recreation', 'Activity', 'Courts for tennis, basketball, or badminton.', true),
    ('Children''s Play Area', 'Recreation', 'Smile', 'Safe and fun play zone for kids.', true),
    ('Jogging Track', 'Recreation', 'Footprints', 'Dedicated tracks for walking and running.', true),
    ('Yoga Deck', 'Recreation', 'Flower', 'Peaceful space for yoga and meditation.', true),
    
    -- Parking
    ('Covered Parking', 'Parking', 'Car', 'Designated covered parking spaces.', true),
    ('Visitor Parking', 'Parking', 'CircleParking', 'Ample parking for guests and visitors.', true),
    ('EV Charging', 'Parking', 'BatteryCharging', 'Electric vehicle charging stations.', true),
    
    -- Utilities
    ('Lift', 'Utilities', 'ArrowUpCircle', 'High-speed elevators with power backup.', true),
    ('Power Backup', 'Utilities', 'Zap', '100% power backup for common areas and apartments.', true),
    ('Water Supply', 'Utilities', 'Droplets', '24x7 treated water supply.', true),
    ('Rain Water Harvesting', 'Utilities', 'CloudRain', 'Eco-friendly rainwater collection systems.', true),
    ('Sewage Treatment Plant', 'Utilities', 'Settings', 'In-house waste management and treatment.', true),
    
    -- Lifestyle
    ('Landscaped Garden', 'Lifestyle', 'TreePine', 'Beautifully designed green spaces and parks.', true),
    ('Party Hall', 'Lifestyle', 'GlassWater', 'Multipurpose hall for events and gatherings.', true),
    ('Community Hall', 'Lifestyle', 'Users', 'Space for community meetings and functions.', true),
    ('Senior Citizen Zone', 'Lifestyle', 'Heart', 'Relaxing areas designed for the elderly.', true),
    ('Pet Park', 'Lifestyle', 'Dog', 'Dedicated safe area for pets.', true)
ON CONFLICT ("name") DO NOTHING;

