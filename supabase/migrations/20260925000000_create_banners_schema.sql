-- Create Banners Schema

CREATE TABLE IF NOT EXISTS "public"."banners" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "title" varchar(255) NOT NULL,
    "image_url" text NOT NULL,
    "link_url" text,
    "is_active" boolean DEFAULT true NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- Enable RLS
ALTER TABLE "public"."banners" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access for active banners" ON "public"."banners" 
FOR SELECT USING ("is_active" = true);

CREATE POLICY "Admin full access to banners" ON "public"."banners" 
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER "update_banners_updated_at" BEFORE UPDATE ON "public"."banners" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
