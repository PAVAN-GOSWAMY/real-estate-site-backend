CREATE TABLE public.location_import_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    provider VARCHAR NOT NULL,
    total_processed INTEGER NOT NULL DEFAULT 0,
    created_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0,
    skipped_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    rejected_details JSONB, -- Array of rejected items and reasons
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- RLS
ALTER TABLE public.location_import_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage location import logs" ON public.location_import_logs
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Index
CREATE INDEX idx_location_import_logs_city ON public.location_import_logs(city_id);
