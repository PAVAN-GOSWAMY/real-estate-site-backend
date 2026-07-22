-- ============================================================================
-- Create Properties Table
-- ============================================================================

-- Create Enums
CREATE TYPE property_status AS ENUM ('ACTIVE', 'INACTIVE', 'SOLD', 'UPCOMING');
CREATE TYPE property_availability AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD_OUT');
CREATE TYPE property_type AS ENUM ('Apartment', 'Villa', 'Plot', 'Commercial', 'Office', 'Retail', 'Warehouse', 'Penthouse');
CREATE TYPE construction_status AS ENUM ('READY_TO_MOVE', 'UNDER_CONSTRUCTION', 'NEW_LAUNCH');

create table public.properties (
    id uuid primary key default gen_random_uuid(),
    
    title text not null,
    slug text not null,
    property_code text not null,
    
    builder_id uuid not null references public.builders(id) on delete restrict,
    
    property_type property_type not null,
    status property_status not null default 'ACTIVE',
    availability property_availability not null default 'AVAILABLE',
    
    address text,
    locality text,
    city text,
    state text,
    country text default 'India',
    pincode text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    
    price numeric(15,2),
    currency text default 'INR',
    price_per_sqft numeric(10,2),
    
    bedrooms integer,
    bathrooms integer,
    balconies integer,
    parking integer,
    super_builtup_area numeric(10,2),
    carpet_area numeric(10,2),
    floor_number integer,
    total_floors integer,
    facing text,
    possession_date date,
    construction_status construction_status,
    
    short_description text,
    description text,
    
    is_featured boolean not null default false,
    is_verified boolean not null default false,
    
    meta_title text,
    meta_description text,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    
    constraint properties_slug_unique unique (slug),
    constraint properties_code_unique unique (property_code)
);

-- Enable RLS
alter table public.properties enable row level security;

-- Policies (matching builders pattern: public read, admin write)
create policy "Allow public read access on properties" on public.properties
    for select using (true);

create policy "Allow admin insert on properties" on public.properties
    for insert with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin update on properties" on public.properties
    for update using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on properties" on public.properties
    for delete using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

-- Add updated_at trigger
create trigger handle_updated_at
    before update on public.properties
    for each row
    execute function public.update_updated_at_column();
