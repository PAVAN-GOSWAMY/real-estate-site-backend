-- ============================================================================
-- Create Property Assets Tables & Storage
-- ============================================================================

-- 1. Property Floor Plans Table
create table public.property_floor_plans (
    id uuid primary key default gen_random_uuid(),
    property_id uuid not null references public.properties(id) on delete cascade,
    name text not null,
    floor_number text,
    configuration text not null,
    area numeric not null,
    unit text not null,
    image_url text not null,
    description text,
    display_order integer not null default 0,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null
);

-- Enable RLS on floor plans
alter table public.property_floor_plans enable row level security;

create policy "Allow public read access on property_floor_plans" on public.property_floor_plans
    for select using (true);

create policy "Allow admin insert on property_floor_plans" on public.property_floor_plans
    for insert with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin update on property_floor_plans" on public.property_floor_plans
    for update using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on property_floor_plans" on public.property_floor_plans
    for delete using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create trigger handle_updated_at_property_floor_plans
    before update on public.property_floor_plans
    for each row
    execute function public.update_updated_at_column();

-- 2. Property Documents Table
create table public.property_documents (
    id uuid primary key default gen_random_uuid(),
    property_id uuid not null references public.properties(id) on delete cascade,
    name text not null,
    document_type text not null,
    file_url text not null,
    file_size bigint not null,
    version integer not null default 1,
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null
);

-- Enable RLS on documents
alter table public.property_documents enable row level security;

create policy "Allow public read access on property_documents" on public.property_documents
    for select using (true);

create policy "Allow admin insert on property_documents" on public.property_documents
    for insert with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin update on property_documents" on public.property_documents
    for update using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on property_documents" on public.property_documents
    for delete using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create trigger handle_updated_at_property_documents
    before update on public.property_documents
    for each row
    execute function public.update_updated_at_column();

-- 3. Create Storage Bucket for Assets
insert into storage.buckets (id, name, public) 
values ('property-assets', 'property-assets', true)
on conflict (id) do nothing;

-- 4. Storage Bucket RLS Policies
create policy "Allow public read access on property-assets bucket"
    on storage.objects for select
    using (bucket_id = 'property-assets');

create policy "Allow admin insert on property-assets bucket"
    on storage.objects for insert
    with check (
        bucket_id = 'property-assets' and
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin update on property-assets bucket"
    on storage.objects for update
    using (
        bucket_id = 'property-assets' and
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );

create policy "Allow admin delete on property-assets bucket"
    on storage.objects for delete
    using (
        bucket_id = 'property-assets' and
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin' and is_active = true
        )
    );
