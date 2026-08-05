CREATE TABLE IF NOT EXISTS public.profiles (id uuid primary key, role text, is_active boolean);
-- ============================================================================
-- Create Builders Table
-- Sprint 2 - Phase A
-- ============================================================================

create table public.builders (
    id uuid primary key default gen_random_uuid(),

    name text not null,
    slug text not null,

    logo_url text,

    description text,

    established_year integer,

    headquarters text,

    website text,

    email text,

    phone text,

    is_featured boolean not null default false,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint builders_name_unique unique (name),

    constraint builders_slug_unique unique (slug)
);