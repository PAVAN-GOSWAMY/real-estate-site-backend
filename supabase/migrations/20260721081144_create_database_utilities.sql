-- ============================================================================
-- Shared Database Utilities
-- ============================================================================
-- This migration creates reusable database functions that will be shared
-- across multiple tables in the application.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Automatically update the updated_at column on every UPDATE
-- --------------------------------------------------------------------------

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

comment on function public.update_updated_at_column is
'Automatically updates the updated_at column before each row update.';