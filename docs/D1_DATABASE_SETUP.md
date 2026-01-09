# D1 Database Setup Guide

Complete guide for setting up Cloudflare D1 database for Reflexhon Global.

## 📋 Overview

Reflexhon Global uses Cloudflare D1 (SQLite-based edge database) to store:
- **Cultural Datasets** (70+ Papiamentu expressions)
- **Reflexion History** (AI reasoning logs)
- **API Logs** (Request/response tracking)
- **User Sessions** (Session management)
- **API Keys** (Authentication)
- **Rate Limits** (Rate limiting data)
- **Cultural Feedback** (User feedback)

---

## 🚀 Quick Start

### Step 1: Create D1 Database

```bash
# Create the database
wrangler d1 create reflexhon_global

# Output will look like:
# [[d1_databases]]
# binding = "DB"
# database_name = "reflexhon_global"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Update wrangler.toml

Copy the `database_id` from Step 1 and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "reflexhon_global"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace PLACEHOLDER_DB_ID
```

### Step 3: Run Migrations

```bash
# Apply initial schema
wrangler d1 execute reflexhon_global \
  --file=./migrations/0001_initial_schema.sql \
  --remote

# Seed cultural datasets (70+ entries)
wrangler d1 execute reflexhon_global \
  --file=./migrations/0002_seed_cultural_datasets.sql \
  --remote
```

### Step 4: Verify Setup

```bash
# Check table count
wrangler d1 execute reflexhon_global \
  --command "SELECT name FROM sqlite_master WHERE type='table'" \
  --remote

# Verify cultural datasets
wrangler d1 execute reflexhon_global \
  --command "SELECT COUNT(*) as total FROM cultural_datasets" \
  --remote

# Should return: total = 70

# Check by category
wrangler d1 execute reflexhon_global \
  --command "SELECT category, COUNT(*) as count FROM cultural_datasets GROUP BY category" \
  --remote
```

---

## 📊 Database Schema

### Tables

#### 1. cultural_datasets
Stores Papiamentu cultural expressions and contexts.

**Key Fields:**
- `id` - Unique identifier
- `input` - Papiamentu question/text
- `output` - Cultural response
- `category` - emotions, values, family, community, culture, language, respect
- `language` - papiamentu, english, dutch
- `cultural_context` - caribbean
- `cultural_alignment_score` - 0-100
- `empathy_score` - 0-100
- `respeto_score` - 0-100
- `usage_count` - Number of times used
- `positive_feedback` / `negative_feedback` - User feedback counts

**Indexes:**
- Category, language, status, active, created_at, usage_count
- **Full-text search** (FTS5) on input, output, category, tags

#### 2. reflexion_history
Logs AI reflexion processing and reasoning.

**Key Fields:**
- `user_input` - User's question
- `ai_output` - AI's response
- `analysis_result` - JSON: reasoning analysis
- `reflection_thoughts` - JSON: self-reflection
- `cultural_alignment_score` - 0-100
- `ai_model` - Model used
- `ai_source` - cloudflare_ai, huggingface_ai, rule_based
- `processing_time_ms` - Response time

#### 3. api_logs
Comprehensive API request/response logging.

**Key Fields:**
- `request_method`, `request_path`, `request_body`
- `response_status`, `response_body`, `response_time_ms`
- `client_ip`, `client_country`, `client_user_agent`
- `cache_status` - HIT, MISS, BYPASS
- `error_type`, `error_message`

#### 4. user_sessions
Track user sessions (future auth).

#### 5. api_keys
API key management (future auth).

#### 6. rate_limits
Rate limiting tracking per key/IP.

#### 7. cultural_feedback
User feedback on AI responses.

### Views

- `v_popular_datasets` - Most used cultural datasets
- `v_api_performance` - API performance metrics by date/path
- `v_cultural_metrics` - Cultural alignment metrics over time

---

## 💻 Using the Database Service

### Initialize Database Service

```javascript
import { createDatabaseService } from './services/db.js';
import { createCulturalDataService } from './services/cultural-data.js';

// In your Worker
export default {
  async fetch(request, env, ctx) {
    // Create database service
    const dbService = createDatabaseService(env.DB);

    // Create cultural data service
    const culturalData = createCulturalDataService(dbService);

    // Use it!
    const datasets = await culturalData.getAll({ category: 'emotions', limit: 10 });

    return new Response(JSON.stringify(datasets), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### Common Operations

```javascript
// Get all datasets with filters
const result = await culturalData.getAll({
  category: 'emotions',
  language: 'papiamentu',
  status: 'approved',
  limit: 50,
  offset: 0
});

// Search datasets
const searchResults = await culturalData.search('empatia', {
  category: 'emotions',
  limit: 20
});

// Get by ID
const dataset = await culturalData.getById('papiamentu_001');

// Get popular datasets
const popular = await culturalData.getPopular(10);

// Get statistics
const stats = await culturalData.getStats();

// Create new dataset
const newDataset = await culturalData.create({
  input: 'Kiko ta amor?',
  output: 'Amor ta un sentimento profundo...',
  category: 'emotions',
  language: 'papiamentu'
});

// Update dataset
await culturalData.update('papiamentu_001', {
  output: 'Updated response...'
});

// Add feedback
await culturalData.addFeedback('papiamentu_001', true); // positive
```

---

## 🔍 Querying Data

### Using wrangler CLI

```bash
# Get all cultural datasets
wrangler d1 execute reflexhon_global \
  --command "SELECT * FROM cultural_datasets LIMIT 5" \
  --remote

# Search by category
wrangler d1 execute reflexhon_global \
  --command "SELECT * FROM cultural_datasets WHERE category = 'emotions'" \
  --remote

# Get statistics
wrangler d1 execute reflexhon_global \
  --command "SELECT * FROM v_popular_datasets" \
  --remote
```

### Using Database Service

```javascript
// Raw SQL query
const result = await dbService.query(
  'SELECT * FROM cultural_datasets WHERE category = ? LIMIT ?',
  ['emotions', 10]
);

// Single row query
const dataset = await dbService.querySingle(
  'SELECT * FROM cultural_datasets WHERE id = ?',
  ['papiamentu_001']
);

// Batch operations
await dbService.batch([
  { sql: 'INSERT INTO ...', params: [...] },
  { sql: 'UPDATE ...', params: [...] }
]);
```

---

## 📈 Monitoring & Analytics

### Check Database Stats

```javascript
// Get overall database stats
const dbStats = await dbService.getStats();

// Get cultural data stats
const culturalStats = await culturalData.getStats();

console.log(culturalStats);
// {
//   total: 70,
//   byCategory: [...],
//   byLanguage: [...],
//   averageScores: {...}
// }
```

### View Performance Metrics

```bash
# API performance by date
wrangler d1 execute reflexhon_global \
  --command "SELECT * FROM v_api_performance WHERE date = DATE('now')" \
  --remote

# Cultural alignment metrics
wrangler d1 execute reflexhon_global \
  --command "SELECT * FROM v_cultural_metrics ORDER BY date DESC LIMIT 7" \
  --remote
```

---

## 🧪 Testing

### Test Database Connection

```javascript
// In your Worker or test
const isConnected = await dbService.testConnection();
console.log('Database connected:', isConnected);
```

### Verify Data Integrity

```bash
# Check for missing data
wrangler d1 execute reflexhon_global \
  --command "SELECT id FROM cultural_datasets WHERE input IS NULL OR output IS NULL" \
  --remote

# Check category distribution
wrangler d1 execute reflexhon_global \
  --command "SELECT category, COUNT(*) FROM cultural_datasets GROUP BY category" \
  --remote
```

---

## 🔄 Migrations

### Creating New Migrations

1. Create a new file in `/migrations/` with format: `XXXX_description.sql`
2. Add your SQL statements
3. Run with: `wrangler d1 execute reflexhon_global --file=./migrations/XXXX_description.sql --remote`

Example:
```sql
-- migrations/0003_add_user_table.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO schema_version (version, description) VALUES
('1.1.0', 'Added users table');
```

### Rolling Back

D1 doesn't have automatic rollback. To rollback:
1. Create a new migration that undoes the changes
2. Or restore from a backup

---

## 💾 Backups

### Export Database

```bash
# Export to SQL dump (local only)
wrangler d1 execute reflexhon_global --command ".dump" --local > backup.sql

# For remote, use API or scheduled exports
```

### Restore from Backup

```bash
wrangler d1 execute reflexhon_global --file=backup.sql --remote
```

---

## 🚨 Troubleshooting

### Database Not Found
```
Error: Database 'reflexhon_global' not found
```
**Solution:** Create the database first with `wrangler d1 create reflexhon_global`

### Migration Fails
```
Error: table cultural_datasets already exists
```
**Solution:** The schema uses `IF NOT EXISTS`, so this should be rare. Drop tables manually if needed.

### Slow Queries
**Solution:**
- Check indexes are created
- Use EXPLAIN QUERY PLAN to analyze
- Consider adding more indexes

### FTS Search Not Working
**Solution:**
- Verify FTS table exists: `SELECT * FROM sqlite_master WHERE name='cultural_datasets_fts'`
- Check triggers are in place
- Rebuild FTS index if needed

---

## 📚 Resources

- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ Checklist

Before deploying to production:

- [ ] D1 database created
- [ ] `wrangler.toml` updated with correct `database_id`
- [ ] Initial schema migration applied
- [ ] Seed data imported (70 datasets)
- [ ] Database connection tested
- [ ] All tables created successfully
- [ ] Indexes verified
- [ ] FTS search working
- [ ] Views created
- [ ] Sample queries tested
- [ ] Worker has DB binding access
- [ ] Monitoring setup (optional)

---

**Last Updated:** 2026-01-09
**Schema Version:** 1.0.0
**Total Datasets:** 70
**Categories:** emotions, values, family, community, culture, language, respect
