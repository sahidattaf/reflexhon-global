# Cloudflare Quick Start Guide

This guide will walk you through getting your Cloudflare credentials and creating the necessary resources for Reflexhon Cloud.

## Prerequisites

- A Cloudflare account (free tier works fine)
- Node.js 18+ installed
- Git configured

---

## Step 1: Get Your Cloudflare Account ID

### Option A: From Dashboard (Easiest)

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Log in to your account
3. Click on **"Workers & Pages"** in the left sidebar
4. Your **Account ID** is displayed on the right side of the page under "Account details"
5. Click the copy icon to copy it

### Option B: From Any Domain

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Click on any of your domains (or skip if you don't have any)
3. Scroll down the right sidebar
4. Look for **"Account ID"** in the API section
5. Click to copy

**Save this somewhere - you'll need it for GitHub Secrets!**

---

## Step 2: Create a Cloudflare API Token

### 2.1 Navigate to API Tokens

1. Go to [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Or: Click your profile icon (top right) → **"My Profile"** → **"API Tokens"** tab

### 2.2 Create Token

1. Click the **"Create Token"** button
2. Find the **"Edit Cloudflare Workers"** template
3. Click **"Use template"** next to it

### 2.3 Configure Token Permissions

The template should already have these permissions set:

**Account Permissions:**
- Workers Scripts: Edit
- Workers KV Storage: Edit
- D1: Edit
- Account Settings: Read

**Zone Permissions** (if you have a domain):
- Workers Routes: Edit

### 2.4 Set Account Resources

1. Under **"Account Resources"**:
   - Select **"Include"** → **"Your Account Name"**

2. Under **"Zone Resources"** (if applicable):
   - Select **"Include"** → **"All zones"** or specific zone

### 2.5 Optional: Set IP Restrictions

For better security, you can restrict the token to GitHub Actions IPs, but this is optional for now.

### 2.6 Create and Save Token

1. Click **"Continue to summary"**
2. Review the permissions
3. Click **"Create Token"**
4. **IMPORTANT**: Copy the token immediately - you won't see it again!
5. Save it somewhere secure (password manager recommended)

**This is your `CLOUDFLARE_API_TOKEN` for GitHub Secrets!**

---

## Step 3: Install Wrangler CLI

Wrangler is Cloudflare's command-line tool for Workers.

```bash
npm install -g wrangler
```

Verify installation:

```bash
wrangler --version
```

---

## Step 4: Authenticate Wrangler

```bash
wrangler login
```

This will:
1. Open your browser
2. Ask you to authorize Wrangler
3. Click **"Allow"**
4. You'll see "Successfully logged in" in your terminal

---

## Step 5: Create D1 Databases

D1 is Cloudflare's SQL database. We need two: one for staging, one for production.

### 5.1 Create Staging Database

```bash
wrangler d1 create reflexhon_staging
```

**Example output:**
```
✅ Successfully created DB 'reflexhon_staging'!

[[d1_databases]]
binding = "DB"
database_name = "reflexhon_staging"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**COPY the `database_id` value!** This is what you'll use in `wrangler.toml`.

### 5.2 Create Production Database

```bash
wrangler d1 create reflexhon_production
```

**Example output:**
```
✅ Successfully created DB 'reflexhon_production'!

[[d1_databases]]
binding = "DB"
database_name = "reflexhon_production"
database_id = "z9y8x7w6-v5u4-3210-zyxw-vu9876543210"
```

**COPY the `database_id` value!**

### 5.3 Verify Databases

```bash
wrangler d1 list
```

You should see both databases listed.

---

## Step 6: Create KV Namespaces

KV (Key-Value) storage is used for caching.

### 6.1 Create Staging KV Namespace

```bash
wrangler kv:namespace create "CACHE" --env staging
```

**Example output:**
```
🌀 Creating namespace with title "reflexhon-cloud-staging-CACHE"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "CACHE", id = "abc123def456ghi789" }
```

**COPY the `id` value!**

### 6.2 Create Production KV Namespace

```bash
wrangler kv:namespace create "CACHE" --env production
```

**Example output:**
```
🌀 Creating namespace with title "reflexhon-cloud-production-CACHE"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "CACHE", id = "xyz789uvw456rst123" }
```

**COPY the `id` value!**

### 6.3 Verify KV Namespaces

```bash
wrangler kv:namespace list
```

You should see both namespaces listed.

---

## Step 7: Update wrangler.toml

Now that you have all the IDs, update your `wrangler.toml` file.

Replace the placeholder values with your actual IDs:

```toml
# Staging environment
[[env.staging.d1_databases]]
binding = "DB"
database_name = "reflexhon_staging"
database_id = "YOUR_STAGING_DB_ID_HERE"  # ← Replace this

[[env.staging.kv_namespaces]]
binding = "CACHE"
id = "YOUR_STAGING_KV_ID_HERE"  # ← Replace this

# Production environment
[[env.production.d1_databases]]
binding = "DB"
database_name = "reflexhon_production"
database_id = "YOUR_PRODUCTION_DB_ID_HERE"  # ← Replace this

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "YOUR_PRODUCTION_KV_ID_HERE"  # ← Replace this
```

---

## Step 8: Configure GitHub Secrets

These secrets allow GitHub Actions to deploy your code automatically.

### 8.1 Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/sahidattaf/reflexhon-global`
2. Click **"Settings"** tab (top right)
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**

### 8.2 Add CLOUDFLARE_API_TOKEN

1. Click **"New repository secret"**
2. Name: `CLOUDFLARE_API_TOKEN`
3. Secret: Paste the API token from Step 2
4. Click **"Add secret"**

### 8.3 Add CF_ACCOUNT_ID

1. Click **"New repository secret"** again
2. Name: `CF_ACCOUNT_ID`
3. Secret: Paste the Account ID from Step 1
4. Click **"Add secret"**

### 8.4 Verify Secrets

You should now see two secrets listed:
- ✓ CLOUDFLARE_API_TOKEN
- ✓ CF_ACCOUNT_ID

**Note**: You won't be able to view the secret values again (they're encrypted).

---

## Step 9: Test Local Deployment

Before pushing to production, test locally:

```bash
# Install dependencies (if not already done)
npm install

# Test with staging environment
wrangler dev --env staging
```

If everything is configured correctly, you should see:
```
⛅️ wrangler 3.x.x
------------------
Your worker has access to the following bindings:
- D1 Databases:
  - DB: reflexhon_staging (a1b2c3d4-e5f6-7890-abcd-ef1234567890)
- KV Namespaces:
  - CACHE: abc123def456ghi789
```

---

## Step 10: Manual Deploy Test

Try deploying to staging manually first:

```bash
wrangler deploy --env staging
```

If successful, you should see:
```
✨ Deployment complete!
https://staging-api.reflexhon.cloud
```

---

## Checklist

Before you're fully set up, make sure you have:

- [ ] Cloudflare Account ID (from Step 1)
- [ ] Cloudflare API Token (from Step 2)
- [ ] Wrangler CLI installed and authenticated (Steps 3-4)
- [ ] Two D1 databases created (Step 5)
- [ ] Two KV namespaces created (Step 6)
- [ ] Updated `wrangler.toml` with real IDs (Step 7)
- [ ] Added GitHub secrets (Step 8)
- [ ] Tested local deployment (Step 9)
- [ ] Tested manual deployment (Step 10)

---

## Common Issues

### "Not authorized" error

**Solution**: Run `wrangler logout` then `wrangler login` again.

### "Database not found"

**Solution**: Double-check the database_id in `wrangler.toml` matches exactly what was returned when you created the database.

### GitHub Actions deployment fails

**Solution**:
1. Verify secrets are correctly named (exact match required)
2. Check that API token has Workers Script Edit permissions
3. Ensure Account ID is correct

### "route already exists"

**Solution**: If you're using a custom domain, make sure DNS is pointing to Cloudflare and the domain is added to your account.

---

## Security Notes

1. **Never commit** API tokens to Git
2. **Rotate tokens** every 90 days
3. **Use environment-specific** resources (don't share production DB with staging)
4. **Enable 2FA** on your Cloudflare account

---

## Next Steps

Once everything is set up:

1. Commit your updated `wrangler.toml` (if you updated it locally)
2. Push to `main` or `reflexhon-cloud-v1` branch
3. Watch GitHub Actions deploy automatically
4. Check deployment at:
   - Staging: `https://staging-api.reflexhon.cloud`
   - Production: `https://api.reflexhon.cloud`

---

## Need Help?

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [KV Documentation](https://developers.cloudflare.com/kv/)

---

**Last Updated**: December 2025
