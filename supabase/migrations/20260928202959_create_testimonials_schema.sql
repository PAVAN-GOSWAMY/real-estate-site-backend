-- Create Testimonials Schema
-- Tables: testimonial_submissions, testimonials

-- 1. Create testimonials bucket
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'testimonials', 
  'testimonials', 
  true, 
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[], 
  5242880
)
ON CONFLICT (id) DO UPDATE SET 
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[],
  file_size_limit = 5242880;

-- Storage RLS for testimonials
CREATE POLICY "Public can upload testimonial images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Public can view testimonial images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'testimonials');

CREATE POLICY "Admins can manage testimonial images"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'testimonials' AND (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])))
WITH CHECK (bucket_id = 'testimonials' AND (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role])));

-- 2. Create tables
CREATE TYPE public.testimonial_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.testimonial_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    profile_image_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    location TEXT,
    status public.testimonial_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    profile_image_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    location TEXT,
    source TEXT DEFAULT 'website',
    submission_id UUID REFERENCES public.testimonial_submissions(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Indexes
CREATE INDEX idx_testimonial_submissions_status ON public.testimonial_submissions(status);
CREATE INDEX idx_testimonials_is_active ON public.testimonials(is_active);
CREATE INDEX idx_testimonials_display_order ON public.testimonials(display_order);

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER handle_updated_at_testimonial_submissions
    BEFORE UPDATE ON public.testimonial_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_testimonials
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. RLS Policies
ALTER TABLE public.testimonial_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Submissions RLS
CREATE POLICY "Public can insert testimonial submissions"
ON public.testimonial_submissions FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view testimonial submissions"
ON public.testimonial_submissions FOR SELECT
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));

CREATE POLICY "Admins can update testimonial submissions"
ON public.testimonial_submissions FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]))
WITH CHECK (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));

CREATE POLICY "Admins can delete testimonial submissions"
ON public.testimonial_submissions FOR DELETE
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));


-- Testimonials RLS
CREATE POLICY "Public can view active testimonials"
ON public.testimonials FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));

CREATE POLICY "Admins can insert testimonials"
ON public.testimonials FOR INSERT
TO authenticated
WITH CHECK (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));

CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]))
WITH CHECK (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE
TO authenticated
USING (public.get_current_user_role() = ANY (ARRAY['Super Admin'::public.admin_role, 'Admin'::public.admin_role]));
