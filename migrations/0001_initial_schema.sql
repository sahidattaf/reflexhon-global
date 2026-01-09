-- ============================================================================
-- REFLEXHON GLOBAL - D1 DATABASE SCHEMA
-- ============================================================================
-- Purpose: Cultural AI Alignment Platform for Papiamentu Language
-- Database: Cloudflare D1 (SQLite-based)
-- Version: 1.0.0
-- Created: 2026-01-09
-- ============================================================================

-- ============================================================================
-- TABLE: cultural_datasets
-- Purpose: Store Papiamentu cultural expressions, contexts, and alignments
-- ============================================================================
CREATE TABLE IF NOT EXISTS cultural_datasets (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- Core Data
    input TEXT NOT NULL,                    -- Original Papiamentu text or question
    output TEXT NOT NULL,                   -- Cultural response or explanation
    category TEXT NOT NULL,                 -- emotions, values, family, community, culture, language, respect

    -- Language & Context
    language TEXT NOT NULL DEFAULT 'papiamentu',
    cultural_context TEXT NOT NULL DEFAULT 'caribbean',

    -- Additional Metadata
    tags TEXT,                              -- JSON array of tags
    difficulty_level TEXT,                  -- beginner, intermediate, advanced
    source TEXT,                            -- origin of the data
    validation_status TEXT DEFAULT 'approved', -- draft, review, approved, deprecated

    -- Cultural Alignment Metrics
    cultural_alignment_score INTEGER DEFAULT 100,
    empathy_score INTEGER DEFAULT 100,
    respeto_score INTEGER DEFAULT 100,

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_used_at TEXT,

    -- Usage Statistics
    usage_count INTEGER DEFAULT 0,
    positive_feedback INTEGER DEFAULT 0,
    negative_feedback INTEGER DEFAULT 0,

    -- Soft Delete
    deleted_at TEXT,
    is_active INTEGER DEFAULT 1,

    -- Constraints
    CHECK (category IN ('emotions', 'values', 'family', 'community', 'culture', 'language', 'respect', 'general')),
    CHECK (validation_status IN ('draft', 'review', 'approved', 'deprecated')),
    CHECK (cultural_alignment_score BETWEEN 0 AND 100),
    CHECK (empathy_score BETWEEN 0 AND 100),
    CHECK (respeto_score BETWEEN 0 AND 100),
    CHECK (is_active IN (0, 1))
);

-- Indexes for cultural_datasets
CREATE INDEX IF NOT EXISTS idx_cultural_datasets_category ON cultural_datasets(category);
CREATE INDEX IF NOT EXISTS idx_cultural_datasets_language ON cultural_datasets(language);
CREATE INDEX IF NOT EXISTS idx_cultural_datasets_status ON cultural_datasets(validation_status);
CREATE INDEX IF NOT EXISTS idx_cultural_datasets_active ON cultural_datasets(is_active);
CREATE INDEX IF NOT EXISTS idx_cultural_datasets_created ON cultural_datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cultural_datasets_usage ON cultural_datasets(usage_count DESC);

-- Full-text search index for cultural_datasets
CREATE VIRTUAL TABLE IF NOT EXISTS cultural_datasets_fts USING fts5(
    id UNINDEXED,
    input,
    output,
    category,
    tags,
    content='cultural_datasets',
    content_rowid='rowid'
);

-- Trigger to keep FTS index in sync
CREATE TRIGGER IF NOT EXISTS cultural_datasets_fts_insert AFTER INSERT ON cultural_datasets BEGIN
    INSERT INTO cultural_datasets_fts(rowid, id, input, output, category, tags)
    VALUES (new.rowid, new.id, new.input, new.output, new.category, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS cultural_datasets_fts_delete AFTER DELETE ON cultural_datasets BEGIN
    DELETE FROM cultural_datasets_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER IF NOT EXISTS cultural_datasets_fts_update AFTER UPDATE ON cultural_datasets BEGIN
    DELETE FROM cultural_datasets_fts WHERE rowid = old.rowid;
    INSERT INTO cultural_datasets_fts(rowid, id, input, output, category, tags)
    VALUES (new.rowid, new.id, new.input, new.output, new.category, new.tags);
END;

-- ============================================================================
-- TABLE: reflexion_history
-- Purpose: Store AI reflexion processing history and reasoning logs
-- ============================================================================
CREATE TABLE IF NOT EXISTS reflexion_history (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- Request Data
    user_input TEXT NOT NULL,
    user_context TEXT,                      -- JSON: {language, cultural_context, situation}

    -- Reflexion Process Data
    analysis_result TEXT,                   -- JSON: reasoning analysis output
    reflection_thoughts TEXT,               -- JSON: self-reflection thoughts
    evaluation_score TEXT,                  -- JSON: quality evaluation
    cultural_pause_markers TEXT,            -- JSON: pause markers applied

    -- Response Data
    ai_output TEXT NOT NULL,
    ai_model TEXT,                          -- @cf/meta/llama-2-7b-chat-int8 or huggingface model
    ai_source TEXT,                         -- cloudflare_ai, huggingface_ai, rule_based

    -- Cultural Alignment Metrics
    cultural_alignment_score INTEGER,
    language_appropriateness INTEGER,
    contextual_relevance INTEGER,
    respectfulness_score INTEGER,

    -- Processing Metadata
    processing_time_ms INTEGER,
    ai_enhanced INTEGER DEFAULT 0,          -- 0 or 1
    ai_fallback INTEGER DEFAULT 0,          -- 0 or 1
    error_message TEXT,

    -- Session Tracking
    session_id TEXT,
    user_id TEXT,
    ip_address TEXT,

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Reference to cultural dataset (if applicable)
    dataset_id TEXT,

    -- Constraints
    CHECK (ai_enhanced IN (0, 1)),
    CHECK (ai_fallback IN (0, 1)),
    CHECK (cultural_alignment_score IS NULL OR cultural_alignment_score BETWEEN 0 AND 100),

    -- Foreign Keys
    FOREIGN KEY (dataset_id) REFERENCES cultural_datasets(id) ON DELETE SET NULL
);

-- Indexes for reflexion_history
CREATE INDEX IF NOT EXISTS idx_reflexion_history_created ON reflexion_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflexion_history_session ON reflexion_history(session_id);
CREATE INDEX IF NOT EXISTS idx_reflexion_history_user ON reflexion_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reflexion_history_model ON reflexion_history(ai_model);
CREATE INDEX IF NOT EXISTS idx_reflexion_history_source ON reflexion_history(ai_source);
CREATE INDEX IF NOT EXISTS idx_reflexion_history_dataset ON reflexion_history(dataset_id);

-- ============================================================================
-- TABLE: api_logs
-- Purpose: Comprehensive API request/response logging for monitoring
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_logs (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- Request Information
    request_method TEXT NOT NULL,           -- GET, POST, PUT, DELETE, etc.
    request_path TEXT NOT NULL,             -- /api/v1/datasets, etc.
    request_query TEXT,                     -- Query parameters as JSON
    request_headers TEXT,                   -- Selected headers as JSON
    request_body TEXT,                      -- Request body (truncated if large)

    -- Response Information
    response_status INTEGER NOT NULL,       -- 200, 404, 500, etc.
    response_body TEXT,                     -- Response body (truncated if large)
    response_time_ms INTEGER,               -- Processing time

    -- Client Information
    client_ip TEXT,
    client_country TEXT,                    -- From Cloudflare headers
    client_user_agent TEXT,

    -- Cache Information
    cache_status TEXT,                      -- HIT, MISS, BYPASS, etc.

    -- API Key / Authentication
    api_key_id TEXT,
    user_id TEXT,

    -- Error Tracking
    error_type TEXT,
    error_message TEXT,
    error_stack TEXT,

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Session Tracking
    session_id TEXT,
    request_id TEXT UNIQUE,                 -- Unique request identifier

    -- Constraints
    CHECK (request_method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'))
);

-- Indexes for api_logs
CREATE INDEX IF NOT EXISTS idx_api_logs_created ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_path ON api_logs(request_path);
CREATE INDEX IF NOT EXISTS idx_api_logs_status ON api_logs(response_status);
CREATE INDEX IF NOT EXISTS idx_api_logs_user ON api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_ip ON api_logs(client_ip);
CREATE INDEX IF NOT EXISTS idx_api_logs_error ON api_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_api_logs_session ON api_logs(session_id);

-- ============================================================================
-- TABLE: user_sessions
-- Purpose: Track user sessions for future authentication system
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- User Information
    user_id TEXT,                           -- Future: link to users table
    session_token TEXT UNIQUE NOT NULL,     -- Secure session token

    -- Session Data
    session_data TEXT,                      -- JSON: arbitrary session data

    -- Device & Location
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,                       -- mobile, tablet, desktop
    country TEXT,
    city TEXT,

    -- Session State
    is_active INTEGER DEFAULT 1,
    last_activity_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,               -- Session expiration

    -- Constraints
    CHECK (is_active IN (0, 1))
);

-- Indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_activity ON user_sessions(last_activity_at DESC);

-- ============================================================================
-- TABLE: api_keys (Future: For API key authentication)
-- Purpose: Manage API keys for external developers
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- Key Information
    key_hash TEXT UNIQUE NOT NULL,          -- Hashed API key (never store plain)
    key_prefix TEXT NOT NULL,               -- First 8 chars for identification
    key_name TEXT,                          -- Human-friendly name

    -- User Association
    user_id TEXT,                           -- Future: link to users table

    -- Permissions & Limits
    tier TEXT DEFAULT 'free',               -- free, pro, enterprise
    rate_limit_per_day INTEGER DEFAULT 1000,
    rate_limit_per_hour INTEGER DEFAULT 100,

    -- Usage Tracking
    total_requests INTEGER DEFAULT 0,
    last_used_at TEXT,

    -- Status
    is_active INTEGER DEFAULT 1,
    is_revoked INTEGER DEFAULT 0,
    revoked_at TEXT,
    revoked_reason TEXT,

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT,                        -- Optional expiration

    -- Constraints
    CHECK (tier IN ('free', 'pro', 'enterprise', 'admin')),
    CHECK (is_active IN (0, 1)),
    CHECK (is_revoked IN (0, 1))
);

-- Indexes for api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active, is_revoked);
CREATE INDEX IF NOT EXISTS idx_api_keys_tier ON api_keys(tier);

-- ============================================================================
-- TABLE: rate_limits
-- Purpose: Track API rate limiting per key/IP
-- ============================================================================
CREATE TABLE IF NOT EXISTS rate_limits (
    -- Composite Primary Key
    identifier TEXT NOT NULL,               -- API key ID or IP address
    window_start TEXT NOT NULL,             -- Start of rate limit window

    -- Usage Data
    request_count INTEGER DEFAULT 0,
    last_request_at TEXT,

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    PRIMARY KEY (identifier, window_start)
);

-- Indexes for rate_limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- ============================================================================
-- TABLE: cultural_feedback
-- Purpose: Collect user feedback on cultural alignment quality
-- ============================================================================
CREATE TABLE IF NOT EXISTS cultural_feedback (
    -- Primary Key
    id TEXT PRIMARY KEY NOT NULL,

    -- Reference Data
    reflexion_id TEXT NOT NULL,             -- Link to reflexion_history
    dataset_id TEXT,                        -- Link to cultural_datasets if applicable

    -- Feedback Data
    feedback_type TEXT NOT NULL,            -- positive, negative, suggestion
    rating INTEGER,                         -- 1-5 stars
    comment TEXT,

    -- Specific Feedback Categories
    language_accuracy INTEGER,              -- 1-5
    cultural_sensitivity INTEGER,           -- 1-5
    helpfulness INTEGER,                    -- 1-5

    -- User Information
    user_id TEXT,
    session_id TEXT,

    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    -- Constraints
    CHECK (feedback_type IN ('positive', 'negative', 'suggestion', 'report')),
    CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    CHECK (language_accuracy IS NULL OR language_accuracy BETWEEN 1 AND 5),
    CHECK (cultural_sensitivity IS NULL OR cultural_sensitivity BETWEEN 1 AND 5),
    CHECK (helpfulness IS NULL OR helpfulness BETWEEN 1 AND 5),

    -- Foreign Keys
    FOREIGN KEY (reflexion_id) REFERENCES reflexion_history(id) ON DELETE CASCADE,
    FOREIGN KEY (dataset_id) REFERENCES cultural_datasets(id) ON DELETE SET NULL
);

-- Indexes for cultural_feedback
CREATE INDEX IF NOT EXISTS idx_cultural_feedback_reflexion ON cultural_feedback(reflexion_id);
CREATE INDEX IF NOT EXISTS idx_cultural_feedback_dataset ON cultural_feedback(dataset_id);
CREATE INDEX IF NOT EXISTS idx_cultural_feedback_type ON cultural_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_cultural_feedback_created ON cultural_feedback(created_at DESC);

-- ============================================================================
-- VIEWS: Useful analytical views
-- ============================================================================

-- View: Popular cultural datasets
CREATE VIEW IF NOT EXISTS v_popular_datasets AS
SELECT
    id,
    input,
    category,
    usage_count,
    positive_feedback,
    negative_feedback,
    cultural_alignment_score,
    ROUND(CAST(positive_feedback AS FLOAT) / NULLIF(positive_feedback + negative_feedback, 0) * 100, 2) as satisfaction_rate
FROM cultural_datasets
WHERE is_active = 1 AND deleted_at IS NULL
ORDER BY usage_count DESC;

-- View: API performance metrics
CREATE VIEW IF NOT EXISTS v_api_performance AS
SELECT
    DATE(created_at) as date,
    request_path,
    COUNT(*) as total_requests,
    AVG(response_time_ms) as avg_response_time,
    MIN(response_time_ms) as min_response_time,
    MAX(response_time_ms) as max_response_time,
    SUM(CASE WHEN response_status >= 200 AND response_status < 300 THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN response_status >= 400 THEN 1 ELSE 0 END) as error_count
FROM api_logs
GROUP BY DATE(created_at), request_path;

-- View: Cultural alignment metrics
CREATE VIEW IF NOT EXISTS v_cultural_metrics AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_reflexions,
    AVG(cultural_alignment_score) as avg_cultural_alignment,
    AVG(language_appropriateness) as avg_language_appropriateness,
    AVG(contextual_relevance) as avg_contextual_relevance,
    AVG(respectfulness_score) as avg_respectfulness,
    AVG(processing_time_ms) as avg_processing_time,
    SUM(ai_enhanced) as ai_enhanced_count,
    ai_source
FROM reflexion_history
WHERE cultural_alignment_score IS NOT NULL
GROUP BY DATE(created_at), ai_source;

-- ============================================================================
-- INITIAL DATA SETUP
-- ============================================================================

-- Note: Seed data will be inserted via separate migration scripts
-- See /migrations/0002_seed_cultural_datasets.sql

-- ============================================================================
-- SCHEMA VERSION TRACKING
-- ============================================================================
CREATE TABLE IF NOT EXISTS schema_version (
    version TEXT PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (datetime('now')),
    description TEXT
);

INSERT INTO schema_version (version, description) VALUES
('1.0.0', 'Initial schema: cultural_datasets, reflexion_history, api_logs, user_sessions, api_keys, rate_limits, cultural_feedback');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
