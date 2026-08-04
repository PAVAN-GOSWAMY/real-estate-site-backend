-- ============================================================================
-- Lock down get_current_user_role function permissions
-- ============================================================================

-- Change ownership to postgres (the default superuser in Supabase)
ALTER FUNCTION public.get_current_user_role() OWNER TO postgres;

-- Revoke all execute permissions from the public role
REVOKE ALL ON FUNCTION public.get_current_user_role() FROM PUBLIC;

-- Grant execute permissions only to authenticated users and service roles
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO service_role;
