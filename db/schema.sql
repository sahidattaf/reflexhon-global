-- ================================================================
-- REFLEXHON GLOBAL v3.0.0 - D1 Database Schema
-- Phase 2: Data Layer Infrastructure
-- ================================================================
-- This schema supports:
-- - Cultural datasets (70+ Papiamentu knowledge entries)
-- - Conversation memory & session tracking
-- - User preferences & learning
-- - Analytics & request logging
-- - Cultural alignment scoring history
-- ================================================================

-- ================================================================
-- TABLE: cultural_datasets
-- Purpose: Store Papiamentu cultural knowledge base
-- ================================================================
CREATE TABLE IF NOT EXISTS cultural_datasets (
    id TEXT PRIMARY KEY,                    -- Dataset ID (e.g., "papiamentu_001")
    category TEXT NOT NULL,                 -- Category (greeting, value, cultural_concept, etc.)
    input TEXT NOT NULL,                    -- Question/input in Papiamentu
    output TEXT NOT NULL,                   -- Response/answer in Papiamentu
    language TEXT DEFAULT 'papiamentu',     -- Primary language
    dialect TEXT,                           -- Dialect (aruba, bonaire, curacao)
    cultural_context TEXT,                  -- Cultural context explanation
    keywords TEXT,                          -- JSON array of keywords for search
    relevance_score REAL DEFAULT 1.0,       -- Relevance score (0-1)
    usage_count INTEGER DEFAULT 0,          -- How many times this dataset was used
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_datasets_category ON cultural_datasets(category);
CREATE INDEX IF NOT EXISTS idx_datasets_language ON cultural_datasets(language);
CREATE INDEX IF NOT EXISTS idx_datasets_dialect ON cultural_datasets(dialect);
CREATE INDEX IF NOT EXISTS idx_datasets_relevance ON cultural_datasets(relevance_score DESC);

-- Full-text search on input/output (for dataset matching)
-- Note: SQLite FTS5 not available in D1 yet, will use LIKE queries for now


-- ================================================================
-- TABLE: sessions
-- Purpose: Track user conversation sessions
-- ================================================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,            -- Unique session identifier
    user_id TEXT,                           -- Optional user ID (for future auth)
    ip_address TEXT,                        -- User IP (for analytics)
    user_agent TEXT,                        -- Browser/client info
    language_preference TEXT DEFAULT 'papiamentu', -- Preferred language
    dialect_preference TEXT,                -- Preferred dialect
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TEXT DEFAULT CURRENT_TIMESTAMP,
    message_count INTEGER DEFAULT 0,        -- Total messages in session
    is_active INTEGER DEFAULT 1,            -- 1 = active, 0 = ended
    metadata TEXT                           -- JSON metadata (timezone, device, etc.)
);

CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(is_active, last_activity_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);


-- ================================================================
-- TABLE: conversation_messages
-- Purpose: Store all conversation messages with context
-- ================================================================
CREATE TABLE IF NOT EXISTS conversation_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,               -- FK to sessions
    role TEXT NOT NULL,                     -- 'user' or 'assistant'
    content TEXT NOT NULL,                  -- Message content
    language TEXT,                          -- Detected language
    dialect TEXT,                           -- Detected dialect
    emotion TEXT,                           -- Detected emotion
    intent TEXT,                            -- Detected intent
    confidence REAL,                        -- Response confidence (0-1)
    cultural_score REAL,                    -- Cultural alignment score (0-1)
    matched_dataset_id TEXT,                -- FK to cultural_datasets (if matched)
    processing_time_ms INTEGER,             -- Processing time
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (matched_dataset_id) REFERENCES cultural_datasets(id)
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON conversation_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_role ON conversation_messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_language ON conversation_messages(language);


-- ================================================================
-- TABLE: user_preferences
-- Purpose: Learning & personalization data per user/session
-- ================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,               -- FK to sessions
    preference_key TEXT NOT NULL,           -- Preference name (e.g., 'preferred_dialect')
    preference_value TEXT NOT NULL,         -- Preference value
    confidence REAL DEFAULT 0.5,            -- Confidence in this preference (0-1)
    learned_from TEXT,                      -- How was this learned? ('explicit', 'implicit')
    occurrence_count INTEGER DEFAULT 1,     -- How many times observed
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    UNIQUE(session_id, preference_key)      -- One preference per key per session
);

CREATE INDEX IF NOT EXISTS idx_preferences_session ON user_preferences(session_id);


-- ================================================================
-- TABLE: analytics_requests
-- Purpose: Log all API requests for analytics
-- ================================================================
CREATE TABLE IF NOT EXISTS analytics_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,                        -- FK to sessions (if available)
    path TEXT NOT NULL,                     -- API path (e.g., '/api/v1/reflexion')
    method TEXT NOT NULL,                   -- HTTP method (GET, POST, etc.)
    status_code INTEGER NOT NULL,           -- HTTP status code
    response_time_ms INTEGER,               -- Response time in ms
    ip_address TEXT,                        -- Client IP
    user_agent TEXT,                        -- Client user agent
    language TEXT,                          -- Detected/requested language
    error_message TEXT,                     -- Error message (if error occurred)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_path ON analytics_requests(path);
CREATE INDEX IF NOT EXISTS idx_analytics_status ON analytics_requests(status_code);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_requests(session_id);


-- ================================================================
-- TABLE: cultural_alignment_scores
-- Purpose: Historical cultural alignment scoring for quality tracking
-- ================================================================
CREATE TABLE IF NOT EXISTS cultural_alignment_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,            -- FK to conversation_messages
    overall_score REAL NOT NULL,            -- Overall cultural alignment (0-1)
    quality_grade TEXT,                     -- A+, A, B+, B, etc.

    -- 10 dimension scores
    language_appropriateness REAL,          -- 0-1
    cultural_sensitivity REAL,              -- 0-1
    contextual_relevance REAL,              -- 0-1
    respectfulness REAL,                    -- 0-1
    empathy_level REAL,                     -- 0-1
    warmth_factor REAL,                     -- 0-1
    dialect_accuracy REAL,                  -- 0-1
    code_switching_quality REAL,            -- 0-1
    cultural_context_depth REAL,            -- 0-1
    authenticity REAL,                      -- 0-1

    strengths TEXT,                         -- JSON array of strengths
    recommendations TEXT,                   -- JSON array of recommendations
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (message_id) REFERENCES conversation_messages(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cultural_scores_message ON cultural_alignment_scores(message_id);
CREATE INDEX IF NOT EXISTS idx_cultural_scores_overall ON cultural_alignment_scores(overall_score DESC);


-- ================================================================
-- TABLE: dataset_usage_stats
-- Purpose: Track which datasets are most useful for learning
-- ================================================================
CREATE TABLE IF NOT EXISTS dataset_usage_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id TEXT NOT NULL,               -- FK to cultural_datasets
    session_id TEXT,                        -- FK to sessions
    match_score REAL,                       -- How well it matched (0-100)
    was_helpful INTEGER,                    -- User feedback (1=yes, 0=no, null=unknown)
    context TEXT,                           -- What was the user asking about?
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dataset_id) REFERENCES cultural_datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_usage_stats_dataset ON dataset_usage_stats(dataset_id);
CREATE INDEX IF NOT EXISTS idx_usage_stats_helpful ON dataset_usage_stats(was_helpful);


-- ================================================================
-- VIEWS: Analytics & Reporting
-- ================================================================

-- Daily request statistics
CREATE VIEW IF NOT EXISTS v_daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT ip_address) as unique_ips,
    AVG(response_time_ms) as avg_response_time,
    SUM(CASE WHEN status_code = 200 THEN 1 ELSE 0 END) as successful_requests,
    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as failed_requests
FROM analytics_requests
GROUP BY DATE(created_at);

-- Most used datasets
CREATE VIEW IF NOT EXISTS v_popular_datasets AS
SELECT
    d.id,
    d.category,
    d.input,
    d.language,
    d.dialect,
    d.usage_count,
    COUNT(dus.id) as recent_uses,
    AVG(dus.match_score) as avg_match_score
FROM cultural_datasets d
LEFT JOIN dataset_usage_stats dus ON d.id = dus.dataset_id
GROUP BY d.id
ORDER BY d.usage_count DESC, recent_uses DESC;

-- Session quality metrics
CREATE VIEW IF NOT EXISTS v_session_quality AS
SELECT
    s.session_id,
    s.started_at,
    s.message_count,
    AVG(cm.confidence) as avg_confidence,
    AVG(cm.cultural_score) as avg_cultural_score,
    AVG(cm.processing_time_ms) as avg_processing_time
FROM sessions s
LEFT JOIN conversation_messages cm ON s.session_id = cm.session_id
WHERE cm.role = 'assistant'
GROUP BY s.session_id;


-- ================================================================
-- TRIGGERS: Auto-update timestamps
-- ================================================================

-- Update sessions.last_activity_at on new message
CREATE TRIGGER IF NOT EXISTS update_session_activity
AFTER INSERT ON conversation_messages
BEGIN
    UPDATE sessions
    SET
        last_activity_at = CURRENT_TIMESTAMP,
        message_count = message_count + 1
    WHERE session_id = NEW.session_id;
END;

-- Update cultural_datasets.usage_count when used
CREATE TRIGGER IF NOT EXISTS increment_dataset_usage
AFTER INSERT ON dataset_usage_stats
BEGIN
    UPDATE cultural_datasets
    SET
        usage_count = usage_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.dataset_id;
END;


-- ================================================================
-- INITIAL DATA: System configuration
-- ================================================================

-- Note: Cultural datasets will be migrated from datasets.js via migration script
-- This ensures 70+ datasets are properly imported with full metadata


-- ================================================================
-- SCHEMA VERSION TRACKING
-- ================================================================
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_version (version, description) VALUES
    (1, 'Initial schema - Phase 2 Data Layer foundation');
