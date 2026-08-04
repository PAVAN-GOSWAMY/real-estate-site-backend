-- ============================================================================
-- Create Site Visits Table
-- ============================================================================

CREATE TYPE public.site_visit_status AS ENUM ('Pending', 'Scheduled', 'Completed', 'Cancelled', 'No Show');

CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    builder_id UUID REFERENCES public.builders(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    visitors_count INTEGER DEFAULT 1 NOT NULL,
    notes TEXT,
    status public.site_visit_status DEFAULT 'Pending'::public.site_visit_status NOT NULL,
    assigned_to_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER update_site_visits_updated_at
    BEFORE UPDATE ON public.site_visits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can insert site visits"
    ON public.site_visits
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view site visits"
    ON public.site_visits
    FOR SELECT
    USING (
        public.get_current_user_role() IN ('Super Admin', 'Admin', 'Sales Executive')
    );

CREATE POLICY "Admins can update site visits"
    ON public.site_visits
    FOR UPDATE
    USING (
        public.get_current_user_role() IN ('Super Admin', 'Admin', 'Sales Executive')
    )
    WITH CHECK (
        public.get_current_user_role() IN ('Super Admin', 'Admin', 'Sales Executive')
    );
