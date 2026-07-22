-- ============================================================================
-- Create Property Media Table
-- ============================================================================

CREATE TYPE media_type AS ENUM ('COVER_IMAGE', 'GALLERY_IMAGE', 'VIDEO', 'VIRTUAL_TOUR');

create table public.property_media (
    id uuid primary key default gen_random_uuid(),
    property_id uuid not null references public.properties(id) on delete cascade,
    media_type media_type not null,
    
    url text not null,
    file_name text,
    file_size integer,
    mime_type text,
    
    display_order integer not null default 0,
    is_featured boolean not null default false,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table public.property_media enable row level security;

-- Policies (matching properties pattern: public read, admin write)
create policy "Allow public read access on property_media" on public.property_media
    for select using (true);

create policy "Allow admin insert on property_media" on public.property_media
    for insert with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin update on property_media" on public.property_media
    for update using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on property_media" on public.property_media
    for delete using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

-- Add updated_at trigger
create trigger handle_updated_at
    before update on public.property_media
    for each row
    execute function public.update_updated_at_column();
