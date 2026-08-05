-- ============================================================================
-- Create Amenities Tables
-- ============================================================================

-- 1. Master Amenities Table
create table public.amenities (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text not null,
    icon text not null default 'Check',
    description text,
    is_active boolean not null default true,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    
    constraint amenities_name_unique unique(name)
);

-- Enable RLS on amenities
alter table public.amenities enable row level security;

create policy "Allow public read access on amenities" on public.amenities
    for select using (true);

create policy "Allow admin insert on amenities" on public.amenities
    for insert with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin update on amenities" on public.amenities
    for update using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on amenities" on public.amenities
    for delete using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create trigger handle_updated_at_amenities
    before update on public.amenities
    for each row
    execute function public.update_updated_at_column();

-- 2. Property Amenities Join Table
create table public.property_amenities (
    property_id uuid not null references public.properties(id) on delete cascade,
    amenity_id uuid not null references public.amenities(id) on delete cascade,
    created_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    
    primary key (property_id, amenity_id)
);

-- Enable RLS on property_amenities
alter table public.property_amenities enable row level security;

create policy "Allow public read access on property_amenities" on public.property_amenities
    for select using (true);

create policy "Allow admin insert on property_amenities" on public.property_amenities
    for insert with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on property_amenities" on public.property_amenities
    for delete using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

-- 3. Seed Default Amenities
insert into public.amenities (name, category, icon) values
    ('24x7 Security', 'Security', 'Shield'),
    ('CCTV Surveillance', 'Security', 'Video'),
    ('Intercom', 'Security', 'Phone'),
    ('Covered Parking', 'Parking', 'Car'),
    ('Visitor Parking', 'Parking', 'CarFront'),
    ('Swimming Pool', 'Sports', 'Waves'),
    ('Tennis Court', 'Sports', 'Activity'),
    ('Basketball Court', 'Sports', 'Dribbble'),
    ('Gymnasium', 'Fitness', 'Dumbbell'),
    ('Yoga Area', 'Fitness', 'Flower2'),
    ('Kids Play Area', 'Kids', 'Baby'),
    ('Power Backup', 'Utilities', 'Zap'),
    ('Water Supply 24/7', 'Utilities', 'Droplets'),
    ('Piped Gas', 'Utilities', 'Flame'),
    ('Club House', 'Community', 'Building2'),
    ('Multipurpose Hall', 'Community', 'Users'),
    ('Landscaped Garden', 'Outdoor', 'TreePine'),
    ('Jogging Track', 'Outdoor', 'Footprints'),
    ('High Speed Elevators', 'Convenience', 'ArrowUpDown'),
    ('Wi-Fi Connectivity', 'Convenience', 'Wifi'),
    ('Smart Home', 'Luxury', 'Smartphone'),
    ('Private Pool', 'Luxury', 'Waves')
on conflict (name) do nothing;
