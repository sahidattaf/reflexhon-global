# 🚀 D1 Database - Quick Deployment Guide

**Phase 2, Week 1 Complete!** Follow these steps to activate your D1 database in production.

---

## ✅ What's Already Done

- ✅ Database schema designed (7 tables, 20+ indexes, FTS search)
- ✅ Migration files created (schema + 70 datasets)
- ✅ Database services built (CRUD operations, search, stats)
- ✅ Worker fully integrated (all endpoints use D1)
- ✅ Comprehensive logging (reflexion + API logs)
- ✅ Admin stats endpoint created
- ✅ Code committed and pushed to GitHub

---

## 🎯 Deployment Steps (5 minutes)

### Step 1: Create D1 Database

```bash
wrangler d1 create reflexhon_global
```

**Output will look like:**
```
✅ Successfully created DB 'reflexhon_global'

[[d1_databases]]
binding = "DB"
database_name = "reflexhon_global"
database_id = "12345678-1234-1234-1234-123456789012"
```

**⚠️ IMPORTANT**: Copy the `database_id` from the output!

---

### Step 2: Update wrangler.toml

Open `wrangler.toml` and find this line:
```toml
database_id = "PLACEHOLDER_DB_ID"
```

Replace `PLACEHOLDER_DB_ID` with your actual database_id:
```toml
database_id = "12345678-1234-1234-1234-123456789012"  # Your actual ID
```

---

### Step 3: Run Schema Migration

```bash
wrangler d1 execute reflexhon_global \
  --file=./migrations/0001_initial_schema.sql \
  --remote
```

**Expected Output:**
```
🌀 Executing on remote database reflexhon_global (12345678-1234-1234-1234-123456789012):
🌀 To execute on your local development database, pass the --local flag.
🚣 Executed 42 commands in 2.5 seconds
```

This creates:
- 7 tables (cultural_datasets, reflexion_history, api_logs, etc.)
- 20+ indexes for performance
- 3 analytical views
- Full-text search (FTS5) on cultural_datasets
- Schema version tracking

---

### Step 4: Seed Cultural Data

```bash
wrangler d1 execute reflexhon_global \
  --file=./migrations/0002_seed_cultural_datasets.sql \
  --remote
```

**Expected Output:**
```
🌀 Executing on remote database reflexhon_global:
🚣 Executed 70 commands in 1.2 seconds
```

This imports **70 Papiamentu cultural expressions** across 7 categories.

---

### Step 5: Verify Data Loaded

```bash
# Check total count
wrangler d1 execute reflexhon_global \
  --command "SELECT COUNT(*) as total FROM cultural_datasets" \
  --remote

# Expected: total = 70

# Check by category
wrangler d1 execute reflexhon_global \
  --command "SELECT category, COUNT(*) as count FROM cultural_datasets GROUP BY category" \
  --remote
```

**Expected Output:**
```
┌───────────┬───────┐
│ category  │ count │
├───────────┼───────┤
│ emotions  │ 12    │
│ values    │ 12    │
│ family    │ 10    │
│ community │ 10    │
│ culture   │ 10    │
│ language  │ 8     │
│ respect   │ 8     │
└───────────┴───────┘
```

---

### Step 6: Deploy to Production

```bash
wrangler deploy
```

**Expected Output:**
```
Total Upload: 125.45 KiB / gzip: 35.12 KiB
Uploaded reflexhon-global (1.23 sec)
Published reflexhon-global (0.45 sec)
  https://reflexhon-global.sahidattaf.workers.dev
```

---

### Step 7: Test Database Endpoints

**Test Health Check (shows database status):**
```bash
curl https://reflexhon-global.sahidattaf.workers.dev/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "version": "1.3.0",
  "features": {
    "database": "healthy"  ← Should say "healthy"!
  }
}
```

**Test Datasets (from D1):**
```bash
curl https://reflexhon-global.sahidattaf.workers.dev/api/v1/datasets
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "papiamentu_001",
      "input": "Kiko ta empatia?",
      "output": "Empatia ta e kapasidat...",
      "category": "emotions"
    },
    // ... 69 more datasets
  ],
  "pagination": {
    "total": 70,
    "hasMore": false
  },
  "source": "d1_database"  ← Should say "d1_database"!
}
```

**Test Admin Stats:**
```bash
curl https://reflexhon-global.sahidattaf.workers.dev/api/v1/admin/stats
```

**Expected Response:**
```json
{
  "success": true,
  "database": {
    "cultural_datasets": 70,
    "reflexion_history": 0,
    "api_logs": 0,
    "schema_version": "1.0.0"
  },
  "cultural_data": {
    "total": 70,
    "byCategory": [...],
    "byLanguage": [...],
    "averageScores": {...}
  }
}
```

---

## ✅ Success Checklist

After deployment, verify:

- [ ] `wrangler d1 create` completed successfully
- [ ] `wrangler.toml` updated with real database_id
- [ ] Schema migration executed (42 commands)
- [ ] Seed migration executed (70 datasets)
- [ ] Verification query shows 70 datasets
- [ ] `wrangler deploy` successful
- [ ] `/health` shows `database: "healthy"`
- [ ] `/api/v1/datasets` returns `source: "d1_database"`
- [ ] `/api/v1/admin/stats` shows database statistics
- [ ] All 7 categories have data

---

## 🎉 What You Get

After deployment:

### Smart Endpoints
- ✅ `/api/v1/datasets` - List all 70 cultural datasets
- ✅ `/api/v1/datasets/:id` - Get specific dataset (tracks usage)
- ✅ `/api/v1/datasets/search?q=empatia` - Full-text search (FTS5)
- ✅ `/api/v1/reflexion/process` - AI processing (logs to database)
- ✅ `/api/v1/admin/stats` - Database analytics

### Powerful Features
- ✅ **Full-Text Search**: Fast FTS5 search across all content
- ✅ **Usage Tracking**: Automatically tracks dataset usage
- ✅ **Comprehensive Logging**: All AI interactions logged
- ✅ **Analytics Ready**: Stats endpoint for monitoring
- ✅ **Smart Fallback**: Works even if database fails

### Data Insights
- ✅ 70 cultural datasets across 7 categories
- ✅ Usage statistics per dataset
- ✅ Popular datasets ranking
- ✅ Cultural alignment scores
- ✅ Processing time metrics

---

## 🐛 Troubleshooting

### Database Not Found
```
Error: Database 'reflexhon_global' not found
```
**Solution**: Run `wrangler d1 create reflexhon_global` first

### Permission Denied
```
Error: 403 Forbidden
```
**Solution**: Make sure you're logged in with `wrangler login`

### Database Shows "disabled" in /health
**Check**:
1. `wrangler.toml` has correct `database_id`
2. Run `wrangler deploy` after updating `wrangler.toml`
3. Wait 1-2 minutes for deployment to propagate

### Zero Datasets Returned
**Solution**: Run seed migration:
```bash
wrangler d1 execute reflexhon_global \
  --file=./migrations/0002_seed_cultural_datasets.sql \
  --remote
```

---

## 📊 Monitor Your Database

### View Recent Reflexions
```bash
wrangler d1 execute reflexhon_global \
  --command "SELECT user_input, ai_output, processing_time_ms FROM reflexion_history ORDER BY created_at DESC LIMIT 5" \
  --remote
```

### Check API Logs
```bash
wrangler d1 execute reflexhon_global \
  --command "SELECT request_path, response_status, response_time_ms FROM api_logs ORDER BY created_at DESC LIMIT 10" \
  --remote
```

### Popular Datasets
```bash
wrangler d1 execute reflexhon_global \
  --command "SELECT * FROM v_popular_datasets LIMIT 10" \
  --remote
```

---

## 🚀 You're Live!

Your **Reflexhon Global API** is now powered by:
- **Cloudflare D1** (edge database)
- **70 cultural datasets** (Papiamentu)
- **Full-text search** (FTS5)
- **Comprehensive logging** (analytics)
- **Smart fallbacks** (reliable)

**Next**: Start Phase 2, Week 2 - KV Caching Layer! 🎯

---

**Questions?** Check `docs/D1_DATABASE_SETUP.md` for complete documentation.

**Created**: 2026-01-09
**Phase**: 2 (Data Layer)
**Week**: 1 (D1 Database) - ✅ COMPLETE!
