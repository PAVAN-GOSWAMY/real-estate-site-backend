-- Create Blog System Schema

CREATE TYPE "public"."blog_status" AS ENUM ('draft', 'published');

CREATE TABLE IF NOT EXISTS "public"."blog_categories" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "description" text,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."blog_tags" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."blogs" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) NOT NULL UNIQUE,
    "excerpt" text,
    "content" text,
    "cover_image" text,
    "category_id" uuid REFERENCES "public"."blog_categories"("id") ON DELETE SET NULL,
    "author_id" uuid REFERENCES "auth"."users"("id") ON DELETE SET NULL,
    "status" "public"."blog_status" DEFAULT 'draft'::"public"."blog_status" NOT NULL,
    "published_at" timestamp with time zone,
    "reading_time" varchar(50),
    "is_featured" boolean DEFAULT false NOT NULL,
    "seo_title" varchar(255),
    "seo_description" text,
    "seo_keywords" text[],
    "created_by" uuid REFERENCES "auth"."users"("id") ON DELETE SET NULL,
    "updated_by" uuid REFERENCES "auth"."users"("id") ON DELETE SET NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."blog_post_tags" (
    "blog_id" uuid REFERENCES "public"."blogs"("id") ON DELETE CASCADE NOT NULL,
    "tag_id" uuid REFERENCES "public"."blog_tags"("id") ON DELETE CASCADE NOT NULL,
    CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("blog_id", "tag_id")
);

-- Triggers for updated_at
CREATE TRIGGER "update_blog_categories_updated_at" BEFORE UPDATE ON "public"."blog_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_blogs_updated_at" BEFORE UPDATE ON "public"."blogs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Enable RLS
ALTER TABLE "public"."blog_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."blog_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."blog_post_tags" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Public read access for active categories" ON "public"."blog_categories" FOR SELECT USING ("is_active" = true);
CREATE POLICY "Admin full access to categories" ON "public"."blog_categories" FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

-- RLS Policies for blog_tags
CREATE POLICY "Public read access for tags" ON "public"."blog_tags" FOR SELECT USING (true);
CREATE POLICY "Admin full access to tags" ON "public"."blog_tags" FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

-- RLS Policies for blogs
CREATE POLICY "Public read access for published blogs" ON "public"."blogs" FOR SELECT USING ("status" = 'published' AND ("published_at" IS NULL OR "published_at" <= now()));
CREATE POLICY "Admin full access to blogs" ON "public"."blogs" FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

-- RLS Policies for blog_post_tags
CREATE POLICY "Public read access for blog_post_tags" ON "public"."blog_post_tags" FOR SELECT USING (
    EXISTS (SELECT 1 FROM "public"."blogs" b WHERE b.id = "public"."blog_post_tags".blog_id AND b.status = 'published')
);
CREATE POLICY "Admin full access to blog_post_tags" ON "public"."blog_post_tags" FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles WHERE admin_roles.user_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_blogs_slug" ON "public"."blogs" ("slug");
CREATE INDEX IF NOT EXISTS "idx_blogs_status" ON "public"."blogs" ("status");
CREATE INDEX IF NOT EXISTS "idx_blogs_published_at" ON "public"."blogs" ("published_at");
CREATE INDEX IF NOT EXISTS "idx_blogs_category" ON "public"."blogs" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_blogs_author" ON "public"."blogs" ("author_id");
CREATE INDEX IF NOT EXISTS "idx_blog_categories_slug" ON "public"."blog_categories" ("slug");
CREATE INDEX IF NOT EXISTS "idx_blog_tags_slug" ON "public"."blog_tags" ("slug");
