-- Migration: 20261113020000_create_property_configurations_table.sql
-- Create child table property_configurations for configuration-wise property details

CREATE TABLE IF NOT EXISTS public.property_configurations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    configuration_type text NOT NULL,
    bedrooms integer,
    bathrooms integer,
    balconies integer,
    parking_slots integer,
    super_built_up_area numeric(10,2),
    carpet_area numeric(10,2),
    floor_number integer,
    total_floors integer,
    facing text,
    possession_date date,
    construction_status public.construction_status,
    base_price numeric(15,2),
    price_display text,
    availability public.property_availability DEFAULT 'AVAILABLE'::public.property_availability,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_property_configurations_property_id ON public.property_configurations(property_id);
CREATE INDEX IF NOT EXISTS idx_property_configurations_type ON public.property_configurations(configuration_type);
CREATE INDEX IF NOT EXISTS idx_property_configurations_price ON public.property_configurations(base_price);
CREATE INDEX IF NOT EXISTS idx_property_configurations_order ON public.property_configurations(display_order);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_property_configurations_updated_at
BEFORE UPDATE ON public.property_configurations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.property_configurations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access on property_configurations"
ON public.property_configurations FOR SELECT USING (true);

CREATE POLICY "Allow admin insert on property_configurations"
ON public.property_configurations FOR INSERT WITH CHECK (
    public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);

CREATE POLICY "Allow admin update on property_configurations"
ON public.property_configurations FOR UPDATE USING (
    public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);

CREATE POLICY "Allow admin delete on property_configurations"
ON public.property_configurations FOR DELETE USING (
    public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])
);

-- Grants
GRANT SELECT ON TABLE public.property_configurations TO anon;
GRANT ALL ON TABLE public.property_configurations TO authenticated;
GRANT ALL ON TABLE public.property_configurations TO service_role;

-- Add configuration_id to property_floor_plans if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'property_floor_plans'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'property_floor_plans'
            AND column_name = 'configuration_id'
        ) THEN
            ALTER TABLE public.property_floor_plans
            ADD COLUMN configuration_id uuid REFERENCES public.property_configurations(id) ON DELETE SET NULL;

            CREATE INDEX IF NOT EXISTS idx_property_floor_plans_config_id ON public.property_floor_plans(configuration_id);
        END IF;
    END IF;
END $$;

-- Backfill initial configuration records for existing properties
INSERT INTO public.property_configurations (
    property_id,
    configuration_type,
    bedrooms,
    bathrooms,
    balconies,
    parking_slots,
    super_built_up_area,
    carpet_area,
    floor_number,
    total_floors,
    facing,
    possession_date,
    construction_status,
    base_price,
    availability,
    display_order
)
SELECT
    p.id,
    COALESCE(
        CASE
            WHEN p.configurations IS NOT NULL AND array_length(p.configurations, 1) > 0 THEN p.configurations[1]
            WHEN p.bedrooms IS NOT NULL AND p.bedrooms > 0 THEN p.bedrooms::text || ' BHK'
            ELSE p.property_type::text
        END,
        'Standard'
    ) as configuration_type,
    p.bedrooms,
    p.bathrooms,
    p.balconies,
    p.parking,
    p.super_builtup_area,
    p.carpet_area,
    p.floor_number,
    p.total_floors,
    p.facing,
    p.possession_date,
    p.construction_status,
    p.price,
    p.availability,
    0
FROM public.properties p
WHERE NOT EXISTS (
    SELECT 1 FROM public.property_configurations pc WHERE pc.property_id = p.id
);
