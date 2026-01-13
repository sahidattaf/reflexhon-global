-- ============================================================================
-- ANALYTICS ENHANCEMENT - Search Analytics Table
-- ============================================================================
-- Purpose: Track search queries and results for trending insights
-- Version: 1.6.0
-- Created: 2026-01-12
-- ============================================================================

-- ============================================================================
-- TABLE: search_analytics
-- Purpose: Track search queries, results, and user behavior
-- ============================================================================
CREATE TABLE IF NOT EXISTS search_analytics (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- Search Data
    search_query TEXT NOT NULL,             -- The search term used
    search_type TEXT NOT NULL,              -- category, fts, all
    results_count INTEGER DEFAULT 0,        -- Number of results returned

    -- User clicked on result
    clicked_result_id TEXT,                 -- ID of dataset user clicked
    click_position INTEGER,                 -- Position in results (1-based)

    -- Client Information
    client_ip TEXT,
    client_country TEXT,
    user_agent TEXT,

    -- Session Tracking
    session_id TEXT,

    -- Performance
    search_time_ms INTEGER,                 -- Time to execute search

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Constraints
    CHECK (search_type IN ('category', 'fts', 'all', 'filter')),
    CHECK (results_count >= 0)
);

-- Indexes for search_analytics
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(search_query);
CREATE INDEX IF NOT EXISTS idx_search_analytics_created ON search_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_clicked ON search_analytics(clicked_result_id);

-- ============================================================================
-- VIEW: Popular Search Terms
-- ============================================================================
CREATE VIEW IF NOT EXISTS v_popular_searches AS
SELECT
    search_query,
    search_type,
    COUNT(*) as search_count,
    AVG(results_count) as avg_results,
    AVG(search_time_ms) as avg_search_time,
    COUNT(clicked_result_id) as click_count,
    ROUND(CAST(COUNT(clicked_result_id) AS FLOAT) / COUNT(*) * 100, 2) as click_through_rate,
    MAX(created_at) as last_searched
FROM search_analytics
GROUP BY search_query, search_type
ORDER BY search_count DESC;

-- ============================================================================
-- VIEW: Trending Datasets (Last 7 Days)
-- ============================================================================
CREATE VIEW IF NOT EXISTS v_trending_datasets AS
SELECT
    cd.id,
    cd.input,
    cd.category,
    cd.usage_count,
    COUNT(DISTINCT sa.session_id) as unique_searchers,
    COUNT(sa.id) as search_appearances,
    COUNT(sa.clicked_result_id) as total_clicks,
    ROUND(CAST(COUNT(sa.clicked_result_id) AS FLOAT) / NULLIF(COUNT(sa.id), 0) * 100, 2) as ctr,
    MAX(cd.last_used_at) as last_accessed
FROM cultural_datasets cd
LEFT JOIN search_analytics sa ON sa.clicked_result_id = cd.id
    AND sa.created_at >= datetime('now', '-7 days')
WHERE cd.is_active = 1 AND cd.deleted_at IS NULL
GROUP BY cd.id, cd.input, cd.category, cd.usage_count
ORDER BY total_clicks DESC, usage_count DESC
LIMIT 50;

-- ============================================================================
-- VIEW: Traffic Overview (Last 24 Hours)
-- ============================================================================
CREATE VIEW IF NOT EXISTS v_traffic_overview AS
SELECT
    request_path,
    COUNT(*) as total_requests,
    COUNT(DISTINCT client_ip) as unique_visitors,
    SUM(CASE WHEN response_status = 200 THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN response_status = 429 THEN 1 ELSE 0 END) as rate_limited_count,
    SUM(CASE WHEN response_status >= 400 THEN 1 ELSE 0 END) as error_count,
    SUM(CASE WHEN cache_status = 'HIT' THEN 1 ELSE 0 END) as cache_hits,
    SUM(CASE WHEN cache_status = 'MISS' THEN 1 ELSE 0 END) as cache_misses,
    AVG(response_time_ms) as avg_response_time,
    MIN(response_time_ms) as min_response_time,
    MAX(response_time_ms) as max_response_time
FROM api_logs
WHERE created_at >= datetime('now', '-24 hours')
GROUP BY request_path;

-- ============================================================================
-- Update schema version
-- ============================================================================
INSERT OR REPLACE INTO schema_version (version, description) VALUES
('1.6.0', 'Analytics enhancement: search_analytics table, trending views, traffic overview');

-- ============================================================================
-- END OF ANALYTICS MIGRATION
-- ============================================================================
