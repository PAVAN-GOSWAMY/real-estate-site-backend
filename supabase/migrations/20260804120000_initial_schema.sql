


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."admin_role" AS ENUM (
    'Super Admin',
    'Admin',
    'Sales Executive'
);


ALTER TYPE "public"."admin_role" OWNER TO "postgres";


CREATE TYPE "public"."audit_event_type" AS ENUM (
    'LOGIN',
    'LOGOUT',
    'PASSWORD_RESET_REQUEST',
    'PASSWORD_CHANGED',
    'PROFILE_UPDATED'
);


ALTER TYPE "public"."audit_event_type" OWNER TO "postgres";


CREATE TYPE "public"."construction_status" AS ENUM (
    'READY_TO_MOVE',
    'UNDER_CONSTRUCTION',
    'NEW_LAUNCH'
);


ALTER TYPE "public"."construction_status" OWNER TO "postgres";


CREATE TYPE "public"."location_type" AS ENUM (
    'LOCALITY',
    'SECTOR',
    'AREA',
    'ZONE',
    'VILLAGE',
    'TOWNSHIP',
    'INDUSTRIAL_AREA',
    'TECH_PARK',
    'COMMERCIAL_HUB'
);


ALTER TYPE "public"."location_type" OWNER TO "postgres";


CREATE TYPE "public"."media_type" AS ENUM (
    'COVER_IMAGE',
    'GALLERY_IMAGE',
    'VIDEO',
    'VIRTUAL_TOUR'
);


ALTER TYPE "public"."media_type" OWNER TO "postgres";


CREATE TYPE "public"."property_availability" AS ENUM (
    'AVAILABLE',
    'RESERVED',
    'SOLD_OUT'
);


ALTER TYPE "public"."property_availability" OWNER TO "postgres";


CREATE TYPE "public"."property_status" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SOLD',
    'UPCOMING'
);


ALTER TYPE "public"."property_status" OWNER TO "postgres";


CREATE TYPE "public"."property_type" AS ENUM (
    'Apartment',
    'Villa',
    'Plot',
    'Commercial',
    'Office',
    'Retail',
    'Warehouse',
    'Penthouse'
);


ALTER TYPE "public"."property_type" OWNER TO "postgres";


CREATE TYPE "public"."site_visit_status" AS ENUM (
    'Pending',
    'Scheduled',
    'Completed',
    'Cancelled',
    'No Show'
);


ALTER TYPE "public"."site_visit_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_builder_performance"("p_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_limit" integer DEFAULT 10) RETURNS TABLE("builder_id" "uuid", "builder_name" "text", "total_leads" bigint, "won_deals" bigint, "conversion_rate" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as builder_id,
    b.name as builder_name,
    COUNT(l.id) as total_leads,
    SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END) as won_deals,
    CASE WHEN COUNT(l.id) > 0 THEN ROUND((SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END)::NUMERIC / COUNT(l.id)::NUMERIC) * 100, 2) ELSE 0 END as conversion_rate
  FROM builders b
  LEFT JOIN properties p ON b.id = p.builder_id
  LEFT JOIN leads l ON p.id = l.property_id 
    AND (p_start_date IS NULL OR l.created_at >= p_start_date)
    AND (p_end_date IS NULL OR l.created_at <= p_end_date)
  GROUP BY b.id, b.name
  HAVING COUNT(l.id) > 0
  ORDER BY total_leads DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_builder_performance"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_crm_kpis"("p_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("total_leads" bigint, "new_leads" bigint, "contacted" bigint, "site_visits" bigint, "negotiation" bigint, "closed_won" bigint, "closed_lost" bigint, "conversion_rate" numeric, "active_pipeline" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_total BIGINT;
  v_won BIGINT;
BEGIN
  -- Count total leads
  SELECT COUNT(*) INTO v_total
  FROM leads
  WHERE (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);

  -- Count won leads
  SELECT COUNT(*) INTO v_won
  FROM leads
  WHERE status = 'Won'
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);

  RETURN QUERY
  SELECT 
    v_total as total_leads,
    (SELECT COUNT(*) FROM leads WHERE status = 'New' AND (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as new_leads,
    (SELECT COUNT(*) FROM leads WHERE status = 'Contacted' AND (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as contacted,
    (SELECT COUNT(*) FROM leads WHERE status = 'Site Visit Scheduled' AND (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as site_visits,
    (SELECT COUNT(*) FROM leads WHERE status = 'Negotiation' AND (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as negotiation,
    v_won as closed_won,
    (SELECT COUNT(*) FROM leads WHERE status = 'Lost' AND (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as closed_lost,
    CASE WHEN v_total > 0 THEN ROUND((v_won::NUMERIC / v_total::NUMERIC) * 100, 2) ELSE 0 END as conversion_rate,
    (SELECT COUNT(*) FROM leads WHERE status NOT IN ('Won', 'Lost', 'Archived') AND (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as active_pipeline;
END;
$$;


ALTER FUNCTION "public"."get_crm_kpis"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_user_role"() RETURNS "public"."admin_role"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT role 
  FROM public.admin_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;


ALTER FUNCTION "public"."get_current_user_role"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_current_user_role"() IS 'Securely fetches the authenticated user''s admin role without triggering RLS policies. Returns a single admin_role or NULL.';



CREATE OR REPLACE FUNCTION "public"."get_lead_sources"("p_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("source_name" "text", "lead_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    source as source_name,
    COUNT(*) as lead_count
  FROM leads
  WHERE (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date)
  GROUP BY source
  ORDER BY lead_count DESC;
END;
$$;


ALTER FUNCTION "public"."get_lead_sources"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_lead_trends"("p_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_interval" "text" DEFAULT 'day'::"text") RETURNS TABLE("date_bucket" "date", "lead_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC(p_interval, created_at)::DATE as date_bucket,
    COUNT(*) as lead_count
  FROM leads
  WHERE (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date)
  GROUP BY DATE_TRUNC(p_interval, created_at)::DATE
  ORDER BY date_bucket ASC;
END;
$$;


ALTER FUNCTION "public"."get_lead_trends"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_interval" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_locality_performance"("p_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_limit" integer DEFAULT 10) RETURNS TABLE("locality_name" "text", "property_count" bigint, "total_leads" bigint, "won_deals" bigint, "conversion_rate" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.locality as locality_name,
    COUNT(DISTINCT p.id) as property_count,
    COUNT(l.id) as total_leads,
    SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END) as won_deals,
    CASE WHEN COUNT(l.id) > 0 THEN ROUND((SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END)::NUMERIC / COUNT(l.id)::NUMERIC) * 100, 2) ELSE 0 END as conversion_rate
  FROM properties p
  LEFT JOIN leads l ON p.id = l.property_id 
    AND (p_start_date IS NULL OR l.created_at >= p_start_date)
    AND (p_end_date IS NULL OR l.created_at <= p_end_date)
  WHERE p.locality IS NOT NULL
  GROUP BY p.locality
  HAVING COUNT(l.id) > 0
  ORDER BY total_leads DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_locality_performance"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_property_performance"("p_start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_limit" integer DEFAULT 10) RETURNS TABLE("property_id" "uuid", "property_name" "text", "locality" "text", "builder_name" "text", "total_leads" bigint, "won_deals" bigint, "lost_deals" bigint, "conversion_rate" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as property_id,
    p.title as property_name,
    p.locality as locality,
    b.name as builder_name,
    COUNT(l.id) as total_leads,
    SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END) as won_deals,
    SUM(CASE WHEN l.status = 'Lost' THEN 1 ELSE 0 END) as lost_deals,
    CASE WHEN COUNT(l.id) > 0 THEN ROUND((SUM(CASE WHEN l.status = 'Won' THEN 1 ELSE 0 END)::NUMERIC / COUNT(l.id)::NUMERIC) * 100, 2) ELSE 0 END as conversion_rate
  FROM properties p
  LEFT JOIN leads l ON p.id = l.property_id 
    AND (p_start_date IS NULL OR l.created_at >= p_start_date)
    AND (p_end_date IS NULL OR l.created_at <= p_end_date)
  LEFT JOIN builders b ON p.builder_id = b.id
  GROUP BY p.id, p.title, p.locality, b.name
  HAVING COUNT(l.id) > 0
  ORDER BY total_leads DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "public"."get_property_performance"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.admin_roles (user_id, role)
  VALUES (new.id, 'Sales Executive');
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_lead_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_lead_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_updated_at_column"() IS 'Automatically updates the updated_at column before each row update.';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."admin_role" DEFAULT 'Sales Executive'::"public"."admin_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."amenities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "icon" "text" DEFAULT 'Check'::"text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."amenities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "event_type" "public"."audit_event_type" NOT NULL,
    "ip_address" "text",
    "user_agent" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."builders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "logo_url" "text",
    "description" "text",
    "established_year" integer,
    "headquarters" "text",
    "website" "text",
    "email" "text",
    "phone" "text",
    "is_featured" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."builders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "state" "text" NOT NULL,
    "country" "text" DEFAULT 'India'::"text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."cities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "cover_letter" "text",
    "resume_url" "text" NOT NULL,
    "status" "text" DEFAULT 'New'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "job_applications_status_check" CHECK (("status" = ANY (ARRAY['New'::"text", 'Reviewing'::"text", 'Shortlisted'::"text", 'Rejected'::"text", 'Hired'::"text"])))
);


ALTER TABLE "public"."job_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "department" "text" NOT NULL,
    "employment_type" "text" NOT NULL,
    "location" "text" NOT NULL,
    "experience" "text" NOT NULL,
    "salary" "text",
    "openings" integer DEFAULT 1 NOT NULL,
    "description" "text",
    "requirements" "text",
    "responsibilities" "text",
    "benefits" "text",
    "skills" "text",
    "status" "text" DEFAULT 'Draft'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "check_job_status" CHECK (("status" = ANY (ARRAY['Draft'::"text", 'Published'::"text", 'Closed'::"text"])))
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_activities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "action_type" "text" NOT NULL,
    "description" "text" NOT NULL,
    "created_by_email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lead_activities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_attachments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "file_name" "text" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "uploaded_by_email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lead_attachments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_follow_ups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "follow_up_date" timestamp with time zone NOT NULL,
    "reminder_type" "text" NOT NULL,
    "comment" "text",
    "status" "text" DEFAULT 'Pending'::"text" NOT NULL,
    "created_by_email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "priority" "text" DEFAULT 'Medium'::"text" NOT NULL,
    "completed_at" timestamp with time zone
);


ALTER TABLE "public"."lead_follow_ups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "note" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "priority" "text" DEFAULT 'Medium'::"text" NOT NULL,
    "follow_up_date" timestamp with time zone
);


ALTER TABLE "public"."lead_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "source" "text" NOT NULL,
    "property_id" "uuid",
    "builder_id" "uuid",
    "message" "text",
    "assigned_to_email" "text",
    "priority" "text" DEFAULT 'Medium'::"text" NOT NULL,
    "status" "text" DEFAULT 'New'::"text" NOT NULL,
    "next_follow_up" timestamp with time zone,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "preferred_visit_date" timestamp with time zone,
    "budget" "text"
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."location_import_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "city_id" "uuid",
    "provider" character varying NOT NULL,
    "total_processed" integer DEFAULT 0 NOT NULL,
    "created_count" integer DEFAULT 0 NOT NULL,
    "updated_count" integer DEFAULT 0 NOT NULL,
    "skipped_count" integer DEFAULT 0 NOT NULL,
    "rejected_count" integer DEFAULT 0 NOT NULL,
    "rejected_details" "jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."location_import_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "city_id" "uuid",
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "type" "public"."location_type" DEFAULT 'LOCALITY'::"public"."location_type" NOT NULL,
    "pincode" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "external_id" "text",
    "provider" "text"
);


ALTER TABLE "public"."locations" OWNER TO "postgres";






CREATE TABLE IF NOT EXISTS "public"."properties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "property_code" "text" NOT NULL,
    "builder_id" "uuid" NOT NULL,
    "property_type" "public"."property_type" NOT NULL,
    "status" "public"."property_status" DEFAULT 'ACTIVE'::"public"."property_status" NOT NULL,
    "availability" "public"."property_availability" DEFAULT 'AVAILABLE'::"public"."property_availability" NOT NULL,
    "country" "text" DEFAULT 'India'::"text",
    "pincode" "text",
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "price" numeric(15,2),
    "currency" "text" DEFAULT 'INR'::"text",
    "price_per_sqft" numeric(10,2),
    "bedrooms" integer,
    "bathrooms" integer,
    "balconies" integer,
    "parking" integer,
    "super_builtup_area" numeric(10,2),
    "carpet_area" numeric(10,2),
    "floor_number" integer,
    "total_floors" integer,
    "facing" "text",
    "possession_date" "date",
    "construction_status" "public"."construction_status",
    "short_description" "text",
    "description" "text",
    "is_featured" boolean DEFAULT false NOT NULL,
    "is_verified" boolean DEFAULT false NOT NULL,
    "meta_title" "text",
    "meta_description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "landmark" "text",
    "google_maps_url" "text",
    "is_premium" boolean DEFAULT false,
    "city_id" "uuid",
    "location_id" "uuid",
    "rera_number" "text"
);


ALTER TABLE "public"."properties" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."property_amenities" (
    "property_id" "uuid" NOT NULL,
    "amenity_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid"
);


ALTER TABLE "public"."property_amenities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."property_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "document_type" "text" NOT NULL,
    "file_url" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."property_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."property_floor_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "floor_number" "text",
    "configuration" "text" NOT NULL,
    "area" numeric NOT NULL,
    "unit" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "description" "text",
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "bedrooms" integer,
    "bathrooms" integer,
    "price" numeric
);


ALTER TABLE "public"."property_floor_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."property_media" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "media_type" "public"."media_type" NOT NULL,
    "url" "text" NOT NULL,
    "file_name" "text",
    "file_size" integer,
    "mime_type" "text",
    "display_order" integer DEFAULT 0 NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."property_media" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_visits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "property_id" "uuid",
    "builder_id" "uuid",
    "preferred_date" "date" NOT NULL,
    "preferred_time" "text" NOT NULL,
    "visitors_count" integer DEFAULT 1 NOT NULL,
    "notes" "text",
    "status" "public"."site_visit_status" DEFAULT 'Pending'::"public"."site_visit_status" NOT NULL,
    "assigned_to_email" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."site_visits" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."amenities"
    ADD CONSTRAINT "amenities_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."amenities"
    ADD CONSTRAINT "amenities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."builders"
    ADD CONSTRAINT "builders_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."builders"
    ADD CONSTRAINT "builders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."builders"
    ADD CONSTRAINT "builders_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_name_state_unique" UNIQUE ("name", "state");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_activities"
    ADD CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_attachments"
    ADD CONSTRAINT "lead_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_follow_ups"
    ADD CONSTRAINT "lead_follow_ups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_notes"
    ADD CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_import_logs"
    ADD CONSTRAINT "location_import_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_name_city_unique" UNIQUE ("name", "city_id");



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");






ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_code_unique" UNIQUE ("property_code");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("property_id", "amenity_id");



ALTER TABLE ONLY "public"."property_documents"
    ADD CONSTRAINT "property_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_floor_plans"
    ADD CONSTRAINT "property_floor_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_media"
    ADD CONSTRAINT "property_media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_visits"
    ADD CONSTRAINT "site_visits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "unique_job_application_email" UNIQUE ("job_id", "email");



CREATE UNIQUE INDEX "cities_slug_idx" ON "public"."cities" USING "btree" ("slug");



CREATE INDEX "idx_lead_activities_created_at" ON "public"."lead_activities" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_lead_activities_lead_id" ON "public"."lead_activities" USING "btree" ("lead_id");



CREATE INDEX "idx_lead_attachments_lead_id" ON "public"."lead_attachments" USING "btree" ("lead_id");



CREATE INDEX "idx_lead_follow_ups_date" ON "public"."lead_follow_ups" USING "btree" ("follow_up_date");



CREATE INDEX "idx_lead_follow_ups_lead_id" ON "public"."lead_follow_ups" USING "btree" ("lead_id");



CREATE INDEX "idx_lead_notes_follow_up_date" ON "public"."lead_notes" USING "btree" ("follow_up_date");



CREATE INDEX "idx_lead_notes_lead_id" ON "public"."lead_notes" USING "btree" ("lead_id");



CREATE INDEX "idx_lead_notes_user_id" ON "public"."lead_notes" USING "btree" ("user_id");



CREATE INDEX "idx_leads_created_at" ON "public"."leads" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_leads_priority" ON "public"."leads" USING "btree" ("priority");



CREATE INDEX "idx_leads_property_id" ON "public"."leads" USING "btree" ("property_id");



CREATE INDEX "idx_leads_status" ON "public"."leads" USING "btree" ("status");



CREATE INDEX "idx_location_import_logs_city" ON "public"."location_import_logs" USING "btree" ("city_id");



CREATE INDEX "locations_city_id_idx" ON "public"."locations" USING "btree" ("city_id");



CREATE INDEX "locations_external_id_provider_idx" ON "public"."locations" USING "btree" ("external_id", "provider");



CREATE UNIQUE INDEX "locations_slug_idx" ON "public"."locations" USING "btree" ("slug");



CREATE INDEX "properties_bedrooms_idx" ON "public"."properties" USING "btree" ("bedrooms");



CREATE INDEX "properties_city_id_idx" ON "public"."properties" USING "btree" ("city_id");





CREATE INDEX "properties_location_id_idx" ON "public"."properties" USING "btree" ("location_id");



CREATE INDEX "properties_price_idx" ON "public"."properties" USING "btree" ("price");



CREATE INDEX "properties_property_type_idx" ON "public"."properties" USING "btree" ("property_type");



CREATE INDEX "properties_status_idx" ON "public"."properties" USING "btree" ("status");



CREATE INDEX "properties_title_trgm_idx" ON "public"."properties" USING "gin" ("title" "public"."gin_trgm_ops");



CREATE INDEX "property_amenities_amenity_id_idx" ON "public"."property_amenities" USING "btree" ("amenity_id");



CREATE INDEX "property_floor_plans_bedrooms_idx" ON "public"."property_floor_plans" USING "btree" ("bedrooms");



CREATE OR REPLACE TRIGGER "builders_set_updated_at" BEFORE UPDATE ON "public"."builders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."job_applications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."properties" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."property_media" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at_amenities" BEFORE UPDATE ON "public"."amenities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at_cities" BEFORE UPDATE ON "public"."cities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at_jobs" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at_locations" BEFORE UPDATE ON "public"."locations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at_property_documents" BEFORE UPDATE ON "public"."property_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "handle_updated_at_property_floor_plans" BEFORE UPDATE ON "public"."property_floor_plans" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_admin_roles_updated_at" BEFORE UPDATE ON "public"."admin_roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_lead_follow_ups_modtime" BEFORE UPDATE ON "public"."lead_follow_ups" FOR EACH ROW EXECUTE FUNCTION "public"."update_lead_timestamp"();



CREATE OR REPLACE TRIGGER "update_lead_notes_modtime" BEFORE UPDATE ON "public"."lead_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_lead_timestamp"();



CREATE OR REPLACE TRIGGER "update_leads_modtime" BEFORE UPDATE ON "public"."leads" FOR EACH ROW EXECUTE FUNCTION "public"."update_lead_timestamp"();



CREATE OR REPLACE TRIGGER "update_site_visits_updated_at" BEFORE UPDATE ON "public"."site_visits" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."amenities"
    ADD CONSTRAINT "amenities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."amenities"
    ADD CONSTRAINT "amenities_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lead_activities"
    ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lead_attachments"
    ADD CONSTRAINT "lead_attachments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lead_follow_ups"
    ADD CONSTRAINT "lead_follow_ups_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lead_notes"
    ADD CONSTRAINT "lead_notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_builder_id_fkey" FOREIGN KEY ("builder_id") REFERENCES "public"."builders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."location_import_logs"
    ADD CONSTRAINT "location_import_logs_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."locations"
    ADD CONSTRAINT "locations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_builder_id_fkey" FOREIGN KEY ("builder_id") REFERENCES "public"."builders"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_documents"
    ADD CONSTRAINT "property_documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_documents"
    ADD CONSTRAINT "property_documents_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_documents"
    ADD CONSTRAINT "property_documents_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_floor_plans"
    ADD CONSTRAINT "property_floor_plans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_floor_plans"
    ADD CONSTRAINT "property_floor_plans_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_floor_plans"
    ADD CONSTRAINT "property_floor_plans_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_media"
    ADD CONSTRAINT "property_media_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_media"
    ADD CONSTRAINT "property_media_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_media"
    ADD CONSTRAINT "property_media_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."site_visits"
    ADD CONSTRAINT "site_visits_builder_id_fkey" FOREIGN KEY ("builder_id") REFERENCES "public"."builders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."site_visits"
    ADD CONSTRAINT "site_visits_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."site_visits"
    ADD CONSTRAINT "site_visits_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE SET NULL;



CREATE POLICY "Admins can create jobs" ON "public"."jobs" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Admins can delete jobs" ON "public"."jobs" FOR DELETE TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Admins can manage builders" ON "public"."builders" TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"]))) WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Admins can manage job applications" ON "public"."job_applications" USING ((("auth"."role"() = 'authenticated'::"text") AND ((("auth"."jwt"() ->> 'role'::"text") = 'Super Admin'::"text") OR (("auth"."jwt"() ->> 'role'::"text") = 'Admin'::"text"))));



CREATE POLICY "Admins can manage location import logs" ON "public"."location_import_logs" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Admins can update jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Admins can update site visits" ON "public"."site_visits" FOR UPDATE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role", 'Sales Executive'::"public"."admin_role"]))) WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role", 'Sales Executive'::"public"."admin_role"])));



CREATE POLICY "Admins can view all jobs" ON "public"."jobs" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Admins can view site visits" ON "public"."site_visits" FOR SELECT USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role", 'Sales Executive'::"public"."admin_role"])));



CREATE POLICY "Allow admin delete on amenities" ON "public"."amenities" FOR DELETE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin delete on properties" ON "public"."properties" FOR DELETE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin delete on property_amenities" ON "public"."property_amenities" FOR DELETE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin delete on property_documents" ON "public"."property_documents" FOR DELETE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin delete on property_floor_plans" ON "public"."property_floor_plans" FOR DELETE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin delete on property_media" ON "public"."property_media" FOR DELETE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin insert on amenities" ON "public"."amenities" FOR INSERT WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin insert on properties" ON "public"."properties" FOR INSERT WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin insert on property_amenities" ON "public"."property_amenities" FOR INSERT WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin insert on property_documents" ON "public"."property_documents" FOR INSERT WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin insert on property_floor_plans" ON "public"."property_floor_plans" FOR INSERT WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin insert on property_media" ON "public"."property_media" FOR INSERT WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin update on amenities" ON "public"."amenities" FOR UPDATE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin update on properties" ON "public"."properties" FOR UPDATE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin update on property_documents" ON "public"."property_documents" FOR UPDATE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin update on property_floor_plans" ON "public"."property_floor_plans" FOR UPDATE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin update on property_media" ON "public"."property_media" FOR UPDATE USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin write on cities" ON "public"."cities" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow admin write on locations" ON "public"."locations" USING (("public"."get_current_user_role"() = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Allow authenticated full access on lead_activities" ON "public"."lead_activities" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated full access on lead_attachments" ON "public"."lead_attachments" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated full access on lead_follow_ups" ON "public"."lead_follow_ups" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated full access on lead_notes" ON "public"."lead_notes" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated full access on leads" ON "public"."leads" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow public insert on lead_activities" ON "public"."lead_activities" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Allow public insert on leads" ON "public"."leads" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Allow public read access on amenities" ON "public"."amenities" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on cities" ON "public"."cities" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on locations" ON "public"."locations" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on properties" ON "public"."properties" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on property_amenities" ON "public"."property_amenities" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on property_documents" ON "public"."property_documents" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on property_floor_plans" ON "public"."property_floor_plans" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on property_media" ON "public"."property_media" FOR SELECT USING (true);



CREATE POLICY "Anyone can insert job applications" ON "public"."job_applications" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public can insert site visits" ON "public"."site_visits" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public can view active builders" ON "public"."builders" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public can view published jobs" ON "public"."jobs" FOR SELECT USING (("status" = 'Published'::"text"));



CREATE POLICY "Super Admin and Admin can view logs" ON "public"."audit_logs" FOR SELECT USING ((( SELECT "admin_roles"."role"
   FROM "public"."admin_roles"
  WHERE ("admin_roles"."user_id" = "auth"."uid"())) = ANY (ARRAY['Super Admin'::"public"."admin_role", 'Admin'::"public"."admin_role"])));



CREATE POLICY "Super Admins can manage all roles" ON "public"."admin_roles" USING (("public"."get_current_user_role"() = 'Super Admin'::"public"."admin_role")) WITH CHECK (("public"."get_current_user_role"() = 'Super Admin'::"public"."admin_role"));



CREATE POLICY "Users can insert own logs" ON "public"."audit_logs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own role" ON "public"."admin_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."admin_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."amenities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."builders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lead_activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lead_attachments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lead_follow_ups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lead_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."location_import_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_amenities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_floor_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_media" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_visits" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";




























































































































































REVOKE ALL ON FUNCTION "public"."get_current_user_role"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";




















GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."admin_roles" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."admin_roles" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."admin_roles" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."amenities" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."amenities" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."amenities" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."audit_logs" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."audit_logs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."audit_logs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."builders" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."builders" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."builders" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."cities" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."cities" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."cities" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."job_applications" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."job_applications" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."job_applications" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."jobs" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."jobs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."jobs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_activities" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_activities" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_activities" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_attachments" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_attachments" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_attachments" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_follow_ups" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_follow_ups" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_follow_ups" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_notes" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_notes" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lead_notes" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."leads" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."leads" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."leads" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."location_import_logs" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."location_import_logs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."location_import_logs" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."locations" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."locations" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."locations" TO "service_role";






GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."properties" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."properties" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."properties" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_amenities" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_amenities" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_amenities" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_documents" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_documents" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_documents" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_floor_plans" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_floor_plans" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_floor_plans" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_media" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_media" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."property_media" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."site_visits" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."site_visits" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."site_visits" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT UPDATE ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT UPDATE ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT UPDATE ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";
































-- ============================================================================
-- Create Storage Buckets
-- ============================================================================
INSERT INTO "storage"."buckets" ("id", "name", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types") VALUES
    ('builder-logos', 'builder-logos', true, false, NULL, NULL),
    ('property-media', 'property-media', true, false, NULL, NULL),
    ('property-assets', 'property-assets', true, false, NULL, NULL),
    ('lead-attachments', 'lead-attachments', true, false, NULL, NULL),
    ('resumes', 'resumes', false, false, NULL, NULL)ON CONFLICT (id) DO NOTHING;
