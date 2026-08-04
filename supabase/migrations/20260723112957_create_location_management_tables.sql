-- =============================================================================
-- Migration: Create Location Management Tables
-- Description: Creates cities and locations tables with RLS and hierarchical linking.
-- =============================================================================

-- Create Enum for Location Types
CREATE TYPE public.location_type AS ENUM ('LOCALITY', 'SECTOR', 'AREA', 'ZONE', 'VILLAGE', 'TOWNSHIP');

-- 1. Create Cities Table
CREATE TABLE public.cities (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null,
    state text not null,
    country text not null default 'India',
    is_active boolean not null default true,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    
    constraint cities_name_state_unique unique(name, state)
);

CREATE UNIQUE INDEX cities_slug_idx ON public.cities (slug);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow admin write on cities" ON public.cities FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_active = true)
);

CREATE TRIGGER handle_updated_at_cities BEFORE UPDATE ON public.cities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Create Locations Table
CREATE TABLE public.locations (
    id uuid primary key default gen_random_uuid(),
    city_id uuid not null references public.cities(id) on delete cascade,
    name text not null,
    slug text not null,
    type public.location_type not null default 'LOCALITY',
    pincode text,
    is_active boolean not null default true,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    
    constraint locations_name_city_unique unique(name, city_id)
);

CREATE UNIQUE INDEX locations_slug_idx ON public.locations (slug);
CREATE INDEX locations_city_id_idx ON public.locations (city_id);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow admin write on locations" ON public.locations FOR ALL USING (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_active = true)
);

CREATE TRIGGER handle_updated_at_locations BEFORE UPDATE ON public.locations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Update Properties Table
ALTER TABLE public.properties 
ADD COLUMN city_id uuid references public.cities(id) on delete set null,
ADD COLUMN location_id uuid references public.locations(id) on delete set null;

CREATE INDEX properties_city_id_idx ON public.properties (city_id);
CREATE INDEX properties_location_id_idx ON public.properties (location_id);
