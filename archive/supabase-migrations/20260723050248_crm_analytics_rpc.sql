-- CRM Analytics RPCs

-- 1. KPI Cards Metrics
CREATE OR REPLACE FUNCTION get_crm_kpis(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  total_leads BIGINT,
  new_leads BIGINT,
  contacted BIGINT,
  site_visits BIGINT,
  negotiation BIGINT,
  closed_won BIGINT,
  closed_lost BIGINT,
  conversion_rate NUMERIC,
  active_pipeline BIGINT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Lead Trends (Daily/Weekly/Monthly)
CREATE OR REPLACE FUNCTION get_lead_trends(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_interval TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date_bucket DATE,
  lead_count BIGINT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Lead Sources
CREATE OR REPLACE FUNCTION get_lead_sources(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  source_name TEXT,
  lead_count BIGINT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Property Performance
CREATE OR REPLACE FUNCTION get_property_performance(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  property_id UUID,
  property_name TEXT,
  locality TEXT,
  builder_name TEXT,
  total_leads BIGINT,
  won_deals BIGINT,
  lost_deals BIGINT,
  conversion_rate NUMERIC
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Builder Performance
CREATE OR REPLACE FUNCTION get_builder_performance(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  builder_id UUID,
  builder_name TEXT,
  total_leads BIGINT,
  won_deals BIGINT,
  conversion_rate NUMERIC
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Locality Performance
CREATE OR REPLACE FUNCTION get_locality_performance(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  locality_name TEXT,
  property_count BIGINT,
  total_leads BIGINT,
  won_deals BIGINT,
  conversion_rate NUMERIC
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
