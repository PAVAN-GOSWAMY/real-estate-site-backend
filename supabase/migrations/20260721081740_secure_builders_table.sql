-- ============================================================================
-- Secure Builders Table
-- Sprint 2 - Phase A
-- ============================================================================

-- Enable Row Level Security
alter table public.builders enable row level security;

-- --------------------------------------------------------------------------
-- Automatically update updated_at
-- --------------------------------------------------------------------------
create trigger builders_set_updated_at
before update on public.builders
for each row
execute function public.update_updated_at_column();

-- --------------------------------------------------------------------------
-- Public Read Access
-- Only active builders are visible
-- --------------------------------------------------------------------------
create policy "Public can view active builders"
on public.builders
for select
using (is_active = true);

-- --------------------------------------------------------------------------
-- Admin Full Access
-- --------------------------------------------------------------------------
create policy "Admins can manage builders"
on public.builders
for all
to authenticated
using (
    exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role = 'admin'
          and profiles.is_active = true
    )
)
with check (
    exists (
        select 1
        from public.profiles
        where profiles.id = auth.uid()
          and profiles.role = 'admin'
          and profiles.is_active = true
    )
);