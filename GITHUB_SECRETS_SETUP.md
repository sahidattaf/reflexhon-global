# GitHub Secrets Setup - Quick Guide

This guide will help you configure GitHub Secrets for automated Cloudflare deployments via GitHub Actions.

## What You Need

1. **Cloudflare API Token** - Create one at https://dash.cloudflare.com/profile/api-tokens
2. **Cloudflare Account ID** - Already in your wrangler.toml: `9a009ef5b0a39e042797e3218c05669c`

---

## Step 1: Get Your Cloudflare API Token

### Create the Token

1. Go to: **https://dash.cloudflare.com/profile/api-tokens**
2. Click **"Create Token"** button
3. Find the **"Edit Cloudflare Workers"** template
4. Click **"Use template"**

### Configure Token Permissions

The template should already have these set, but verify:

**Account Permissions:**
- ✓ Workers Scripts: Edit
- ✓ Workers KV Storage: Edit
- ✓ D1: Edit
- ✓ Account Settings: Read

**Account Resources:**
- Select: **Include → Your Account Name**

### Create and Save

1. Click **"Continue to summary"**
2. Review permissions
3. Click **"Create Token"**
4. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
5. Save it securely (password manager recommended)

---

## Step 2: Add Secrets to GitHub

### Navigate to Secrets Page

**Quick Link:**
```
https://github.com/sahidattaf/reflexhon-global/settings/secrets/actions
```

Or manually:
1. Go to your repository: https://github.com/sahidattaf/reflexhon-global
2. Click **"Settings"** tab
3. Left sidebar: **"Secrets and variables"** → **"Actions"**

### Add Secret #1: CLOUDFLARE_API_TOKEN

1. Click **"New repository secret"**
2. Name: `CLOUDFLARE_API_TOKEN` (must be exact)
3. Secret: Paste your API token from Step 1
4. Click **"Add secret"**

### Add Secret #2: CF_ACCOUNT_ID

1. Click **"New repository secret"** again
2. Name: `CF_ACCOUNT_ID` (must be exact)
3. Secret: `9a009ef5b0a39e042797e3218c05669c`
4. Click **"Add secret"**

### Verify

You should now see two secrets listed:
- ✓ CLOUDFLARE_API_TOKEN
- ✓ CF_ACCOUNT_ID

---

## Step 3: Test GitHub Actions

Once secrets are configured, GitHub Actions will automatically deploy when you push to:

- **`main` branch** → Production deployment
- **`reflexhon-cloud-v1` branch** → Staging deployment

### Manual Test

1. Make a small change (or merge this PR)
2. Push to `main`
3. Go to: https://github.com/sahidattaf/reflexhon-global/actions
4. Watch the deployment run

---

## Troubleshooting

### "Secret not found" error

**Solution**: Verify secret names are exactly:
- `CLOUDFLARE_API_TOKEN` (not CloudflareApiToken or cloudflare_api_token)
- `CF_ACCOUNT_ID` (not CLOUDFLARE_ACCOUNT_ID)

### "Authentication failed" error

**Solution**:
1. Verify API token has correct permissions
2. Token might have expired - create a new one
3. Copy the token without extra spaces

### Deployment fails with "not authorized"

**Solution**:
1. Check that Account ID is correct: `9a009ef5b0a39e042797e3218c05669c`
2. Verify API token includes your account in "Account Resources"

### Can't access Settings tab

**Solution**: You need admin/owner access to the repository to add secrets. Contact the repository owner.

---

## Security Notes

1. ✅ **Never commit** secrets to Git
2. ✅ **Never share** your API token
3. ✅ **Rotate tokens** every 90 days
4. ✅ **Use specific permissions** (Edit Cloudflare Workers template)
5. ✅ **Enable 2FA** on your Cloudflare account

---

## What Happens After Setup

Once secrets are configured:

1. **Automatic Deployments**:
   - Push to `main` → Deploys to production automatically
   - Push to `reflexhon-cloud-v1` → Deploys to staging automatically

2. **Build Process**:
   - Runs tests (must pass)
   - Runs linter (must pass)
   - Deploys to Cloudflare Workers

3. **View Deployments**:
   - GitHub Actions: https://github.com/sahidattaf/reflexhon-global/actions
   - Cloudflare Dashboard: https://dash.cloudflare.com → Workers & Pages

---

## Quick Reference

| Secret Name | Value | Where to Get It |
|------------|-------|----------------|
| `CLOUDFLARE_API_TOKEN` | Your API token | https://dash.cloudflare.com/profile/api-tokens |
| `CF_ACCOUNT_ID` | `9a009ef5b0a39e042797e3218c05669c` | Already in wrangler.toml |

---

## Next Steps

After configuring secrets:

1. ✅ Merge the deployment fixes PR
2. ✅ Push to `main` branch
3. ✅ Watch GitHub Actions deploy automatically
4. ✅ Verify deployment at https://reflexhon-cloud.workers.dev
5. 📖 Optional: Create Cloudflare resources for D1/KV (see CLOUDFLARE_SETUP.md)

---

**Need Help?**
- [Cloudflare API Tokens Docs](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [GitHub Actions Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Last Updated**: December 2025
