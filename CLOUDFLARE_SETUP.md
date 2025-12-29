# 🚀 Cloudflare Setup - Quick Reference

This is your quick reference for setting up Cloudflare for Reflexhon Cloud deployment.

## 🎯 What You Need

1. **Cloudflare Account ID** - From your Cloudflare dashboard
2. **API Token** - For GitHub Actions to deploy
3. **D1 Databases** - Two databases (staging + production)
4. **KV Namespaces** - Two caches (staging + production)

---

## ⚡ Quick Start (Automated)

### Option 1: Use the Setup Script

```bash
# Make sure you have wrangler installed
npm install -g wrangler

# Run the automated setup script
./setup-cloudflare-resources.sh
```

This script will:
- ✓ Check if you're authenticated
- ✓ Create D1 databases (staging + production)
- ✓ Create KV namespaces (staging + production)
- ✓ Save all IDs to `cloudflare-resources-ids.txt`

---

## 📖 Detailed Guides

### For Step-by-Step Instructions

Read: **[docs/guides/CLOUDFLARE_QUICKSTART.md](docs/guides/CLOUDFLARE_QUICKSTART.md)**

This comprehensive guide covers:
- Getting your Account ID (with screenshots)
- Creating an API Token
- Installing and authenticating Wrangler
- Creating all resources manually
- Configuring GitHub Secrets
- Testing deployments

### For Production Deployment

Read: **[docs/guides/DEPLOYMENT_SETUP.md](docs/guides/DEPLOYMENT_SETUP.md)**

This guide covers:
- Environment configuration
- Security best practices
- Custom domain setup
- Troubleshooting
- CI/CD workflow details

---

## 🔑 Get Your Credentials

### 1. Account ID

**Where to find it:**
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Look at the right sidebar → "Account details"
4. Copy the Account ID

### 2. API Token

**How to create it:**
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Click "Continue to summary" → "Create Token"
5. **Copy it immediately** (you won't see it again!)

---

## 🛠️ Manual Resource Creation

If you prefer to do it manually:

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create staging database
wrangler d1 create reflexhon_staging

# Create production database
wrangler d1 create reflexhon_production

# Create staging cache
wrangler kv:namespace create "CACHE" --env staging

# Create production cache
wrangler kv:namespace create "CACHE" --env production
```

**Save all the IDs** that are output - you'll need them!

---

## 📝 Update Configuration

### 1. Update wrangler.toml

Replace these placeholders with your actual IDs:

```toml
# In wrangler.toml

# Staging
database_id = "REPLACE_WITH_STAGING_DB_ID"
id = "REPLACE_WITH_STAGING_KV_ID"

# Production
database_id = "REPLACE_WITH_PRODUCTION_DB_ID"
id = "REPLACE_WITH_PRODUCTION_KV_ID"
```

### 2. Add GitHub Secrets

Go to: `https://github.com/sahidattaf/reflexhon-global/settings/secrets/actions`

Add these two secrets:
- **CLOUDFLARE_API_TOKEN** → Your API token from above
- **CF_ACCOUNT_ID** → Your account ID from above

---

## ✅ Verification Checklist

Before deploying, make sure:

- [ ] Wrangler is installed: `wrangler --version`
- [ ] You're logged in: `wrangler whoami`
- [ ] D1 databases exist: `wrangler d1 list`
- [ ] KV namespaces exist: `wrangler kv:namespace list`
- [ ] `wrangler.toml` has real IDs (no "REPLACE_WITH_*")
- [ ] GitHub secrets are configured
- [ ] Dependencies installed: `npm install`

---

## 🧪 Test Before Deploying

```bash
# Test locally with staging config
wrangler dev --env staging

# Manual deploy to staging
wrangler deploy --env staging
```

If this works, you're ready for automatic deployments!

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| `wrangler: command not found` | Run `npm install -g wrangler` |
| `Not authorized` | Run `wrangler logout` then `wrangler login` |
| `Database not found` | Check the database_id matches what `wrangler d1 list` shows |
| GitHub Actions fails | Verify secrets are exactly named `CLOUDFLARE_API_TOKEN` and `CF_ACCOUNT_ID` |

---

## 📚 Resources

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [API Tokens Page](https://dash.cloudflare.com/profile/api-tokens)
- [Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)

---

## 🤝 Need Help?

1. Check the [detailed quickstart guide](docs/guides/CLOUDFLARE_QUICKSTART.md)
2. Review the [deployment guide](docs/guides/DEPLOYMENT_SETUP.md)
3. Open an issue on GitHub
4. Check Cloudflare's community forums

---

**Ready?** Start with `./setup-cloudflare-resources.sh` or follow the [quickstart guide](docs/guides/CLOUDFLARE_QUICKSTART.md)!
