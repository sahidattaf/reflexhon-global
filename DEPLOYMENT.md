# 🚀 Reflexhon Global v3.0.0 - Deployment Guide

Complete guide for deploying to **Cloudflare Workers** with full v3.0.0 capabilities.

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] **Cloudflare Account** - Free tier supports 100,000 requests/day
- [x] **Node.js 18+** - Check with `node --version`
- [x] **Git** - Project committed to repository
- [x] **wrangler.toml** - Already configured with your account_id

---

## 🔑 Step 1: Authentication

Authenticate with Cloudflare:

```bash
npx wrangler login
```

This will:
1. Open browser for Cloudflare login
2. Authorize wrangler CLI access
3. Store credentials locally

**Verify authentication:**
```bash
npx wrangler whoami
```

---

## 🗄️ Step 2: D1 Database Setup (Optional but Recommended)

The D1 database is already created (`reflexhon_global`), but if you need to set it up fresh:

### Create D1 Database:
```bash
npx wrangler d1 create reflexhon_global
```

This will output a database ID. Update `wrangler.toml` line 17 with the new ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "reflexhon_global"
database_id = "YOUR_NEW_DATABASE_ID"
```

### Create Database Schema (Future):
```bash
# When migrations are available:
npx wrangler d1 migrations apply reflexhon_global
```

**Note:** Currently, the system uses in-memory storage with automatic D1 fallback, so D1 is optional for testing.

---

## 🚀 Step 3: Deploy to Production

Deploy v3.0.0 to Cloudflare Workers global edge network:

```bash
npm run deploy
```

Or directly:
```bash
npx wrangler deploy
```

### Expected Output:
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded reflexhon-global (X.XX sec)
Published reflexhon-global (X.XX sec)
  https://reflexhon-global.<your-subdomain>.workers.dev
Current Deployment ID: XXXXXXXX
```

**🎉 Your API is now live at:** `https://reflexhon-global.<your-subdomain>.workers.dev`

---

## 🧪 Step 4: Test Your Deployment

### Health Check:
```bash
curl https://reflexhon-global.<your-subdomain>.workers.dev/health
```

### API Info:
```bash
curl https://reflexhon-global.<your-subdomain>.workers.dev/api
```

### Test Reflexion Engine:
```bash
curl -X POST https://reflexhon-global.<your-subdomain>.workers.dev/api/v1/reflexion \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Kiko ta empatia?",
    "context": {
      "language": "papiamentu",
      "culture": "caribbean"
    }
  }'
```

### Access UIs:
- **Reflexhon Studio:** `https://reflexhon-global.<your-subdomain>.workers.dev/studio`
- **Analytics Dashboard:** `https://reflexhon-global.<your-subdomain>.workers.dev/analytics`

---

## 🔧 Step 5: Local Development Testing

Test the worker locally before deploying:

```bash
npm run deploy:dev
```

This starts a local development server at `http://localhost:8787`

**Test locally:**
```bash
curl http://localhost:8787/health
curl http://localhost:8787/api
```

**Press `B` in terminal** to open browser with local worker.

---

## 📊 Step 6: Monitor Logs (Real-Time)

Watch live logs from production:

```bash
npm run deploy:tail
```

Or:
```bash
npx wrangler tail
```

This streams real-time logs showing:
- All incoming requests
- Processing times
- Errors and warnings
- Console output

---

## 🌍 Step 7: Custom Domain Setup (Optional)

### Add Custom Domain:

1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Select `reflexhon-global`
3. Click **Triggers** → **Custom Domains**
4. Add domain: `api.reflexhon.cloud`

Or via CLI:
```bash
npx wrangler domains add api.reflexhon.cloud
```

### Update wrangler.toml routes:
```toml
[[routes]]
pattern = "api.reflexhon.cloud/*"
zone_name = "reflexhon.cloud"
```

Redeploy:
```bash
npm run deploy
```

---

## 🔐 Step 8: Environment Variables & Secrets

### Set Secrets (Sensitive Data):
```bash
# Example: HuggingFace API token
npx wrangler secret put HF_TOKEN
# Enter your token when prompted
```

### Set Environment Variables:
Update `wrangler.toml`:
```toml
[vars]
NODE_ENV = "production"
LOG_LEVEL = "warn"
```

---

## 📈 Step 9: Analytics & Monitoring

### View Analytics in Dashboard:
1. **Cloudflare Dashboard** → **Workers & Pages** → `reflexhon-global`
2. See: Requests, Success Rate, CPU Time, Duration

### Built-in Analytics API:
```bash
curl https://reflexhon-global.<your-subdomain>.workers.dev/api/v1/analytics
```

Returns:
- Total requests
- Unique visitors
- Cache hit rate
- Top endpoints
- Status code breakdown

---

## 🔄 Step 10: Continuous Deployment

### Update Production:
1. Make changes to code
2. Commit to git
3. Run deployment:
```bash
npm run deploy
```

### Rollback to Previous Version:
```bash
npx wrangler rollback
```

### List Deployments:
```bash
npx wrangler deployments list
```

---

## 🚨 Troubleshooting

### Error: "Authentication required"
**Solution:**
```bash
npx wrangler logout
npx wrangler login
```

### Error: "Account ID not found"
**Solution:** Update `account_id` in `wrangler.toml` with your Cloudflare account ID.

Get account ID:
```bash
npx wrangler whoami
```

### Error: "Module not found"
**Solution:** Ensure all imports in `worker-v3.js` use `.js` extensions:
```javascript
import Service from './services/Service.js'; // ✅ Correct
import Service from './services/Service';    // ❌ Wrong
```

### Error: "D1 database not found"
**Solution:**
1. Create D1 database: `npx wrangler d1 create reflexhon_global`
2. Update database_id in `wrangler.toml`
3. Redeploy: `npm run deploy`

**Or temporarily disable D1:**
Comment out D1 binding in `wrangler.toml`:
```toml
# [[d1_databases]]
# binding = "DB"
# database_name = "reflexhon_global"
# database_id = "..."
```

The system will automatically fall back to in-memory storage.

### Error: "Exceeded script size limit"
**Solution:** Worker is optimized to ~100KB. If exceeded:
1. Remove unused imports
2. Minimize inline HTML in `getStudioHTML()` and `getAnalyticsHTML()`
3. Use external assets via R2 or KV

### Performance Issues:
**Check worker metrics:**
```bash
npx wrangler tail
```

**Optimize:**
- Enable caching in ReflexionEngine (already enabled)
- Use D1 for persistence instead of repeated calculations
- Minimize external API calls

---

## 📋 Quick Reference

### Common Commands:
```bash
npm run deploy           # Deploy to production
npm run deploy:dev       # Local development server
npm run deploy:tail      # Watch live logs
npx wrangler whoami      # Check auth status
npx wrangler login       # Authenticate
npx wrangler deployments list  # View deployments
npx wrangler rollback    # Rollback deployment
```

### Endpoints:
```
Health:      GET  /health
API Info:    GET  /api
Reflexion:   POST /api/v1/reflexion
Datasets:    GET  /api/v1/datasets
Translate:   POST /api/v1/translate
Emotion:     POST /api/v1/emotion
Analytics:   GET  /api/v1/analytics
Studio UI:   GET  /studio
Analytics:   GET  /analytics
```

### Worker Limits (Free Tier):
- **100,000 requests/day**
- **10ms CPU time per request**
- **128 MB memory**
- **1 MB script size**
- **Unlimited bandwidth**

### Cloudflare AI (Free Tier):
- **10,000 neurons/day** (shared across all AI models)
- Models available:
  - `@cf/meta/llama-3-8b-instruct`
  - `@cf/mistral/mistral-7b-instruct-v0.1`
  - `@cf/meta/m2m100-1.2b`
  - `@cf/huggingface/distilbert-sst-2-int8`

---

## 🎯 Production Checklist

Before going live:

- [ ] Test all API endpoints locally (`npm run deploy:dev`)
- [ ] Verify Cloudflare authentication (`npx wrangler whoami`)
- [ ] Update account_id in `wrangler.toml`
- [ ] Set secrets if needed (`npx wrangler secret put`)
- [ ] Deploy to production (`npm run deploy`)
- [ ] Test production endpoints (health, api, reflexion)
- [ ] Monitor logs (`npm run deploy:tail`)
- [ ] Access UIs (/studio, /analytics)
- [ ] Set up custom domain (optional)
- [ ] Configure analytics tracking
- [ ] Document production URL for team

---

## 🌟 What You Get

**Global Edge Deployment:**
- **300+ locations worldwide**
- **< 50ms latency** for 95% of users
- **Automatic scaling** (0 to millions of requests)
- **99.99% uptime SLA**

**v3.0.0 Features:**
- ✅ 5-Layer Reflexion Engine
- ✅ Papiamentu NLP (3 dialects)
- ✅ Emotion & Sentiment Analysis
- ✅ Memory & Learning System
- ✅ 10-Dimension Cultural Scoring
- ✅ Real-time Analytics
- ✅ Complete UI (Studio + Analytics)

**Cost:**
- **$0/month** (Free tier: 100K req/day)
- **$5/month** (Paid tier: 10M req/month)

---

## 🆘 Support

**Issues?**
- GitHub Issues: [reflexhon-global/issues](https://github.com/sahidattaf/reflexhon-global/issues)
- Cloudflare Docs: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- Wrangler Docs: [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler)

**Next Steps:**
- Read `RELEASE_NOTES_v3.0.0.md` for full feature documentation
- Explore `worker-v3.js` for implementation details
- Check `wrangler.toml` for configuration options

---

**🎉 Bo ta listo pa lansa! (You're ready to launch!)**

**Deploy now:**
```bash
npm run deploy
```

**Danki riba bo support!** 🌴
