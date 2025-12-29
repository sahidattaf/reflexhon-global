# Reflexhon Cloud Deployment Setup Guide

This guide walks you through setting up the Reflexhon Global API for deployment to Cloudflare Workers.

## Prerequisites

- Node.js 18 or higher
- npm installed
- A Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)
- Git configured with your GitHub account

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Cloudflare Resources](#cloudflare-resources)
3. [GitHub Secrets Configuration](#github-secrets-configuration)
4. [Local Development](#local-development)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies and generate `package-lock.json`.

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

---

## Cloudflare Resources

You need to create Cloudflare resources and update `wrangler.toml` with the actual IDs.

### 1. Authenticate with Cloudflare

```bash
wrangler login
```

This opens a browser window for authentication.

### 2. Create D1 Databases

Create databases for staging and production:

```bash
# Staging database
wrangler d1 create reflexhon_staging

# Production database
wrangler d1 create reflexhon_production
```

**Important**: Save the `database_id` values from the output.

### 3. Create KV Namespaces

Create KV namespaces for caching:

```bash
# Staging KV namespace
wrangler kv:namespace create "CACHE" --env staging

# Production KV namespace
wrangler kv:namespace create "CACHE" --env production
```

**Important**: Save the `id` values from the output.

### 4. Update wrangler.toml

Replace the placeholder IDs in `wrangler.toml`:

```toml
# Staging environment
[[env.staging.d1_databases]]
binding = "DB"
database_name = "reflexhon_staging"
database_id = "YOUR_STAGING_DB_ID_HERE"  # Replace this

[[env.staging.kv_namespaces]]
binding = "CACHE"
id = "YOUR_STAGING_KV_ID_HERE"  # Replace this

# Production environment
[[env.production.d1_databases]]
binding = "DB"
database_name = "reflexhon_production"
database_id = "YOUR_PRODUCTION_DB_ID_HERE"  # Replace this

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "YOUR_PRODUCTION_KV_ID_HERE"  # Replace this
```

### 5. Configure Custom Domains (Optional)

If you own the `reflexhon.cloud` domain in Cloudflare:

1. Go to Cloudflare Dashboard → Your domain → Workers Routes
2. Add routes for:
   - `api.reflexhon.cloud/*` → reflexhon-cloud (production)
   - `staging-api.reflexhon.cloud/*` → reflexhon-cloud (staging)

If you're using different domains, update the `routes` in `wrangler.toml`.

---

## GitHub Secrets Configuration

For automated deployments via GitHub Actions, you need to add secrets to your repository.

### 1. Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Select your account and zones
5. Click "Continue to summary" → "Create Token"
6. **Copy the token** (you won't see it again)

### 2. Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select Workers & Pages
3. Copy your Account ID from the right sidebar

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Your API token from step 1 |
| `CF_ACCOUNT_ID` | Your account ID from step 2 |

---

## Local Development

### Running the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with auto-reload enabled.

### Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

### Testing with Wrangler Locally

You can test the Cloudflare Workers environment locally:

```bash
# Development environment
wrangler dev

# Staging environment
wrangler dev --env staging

# Production environment (be careful!)
wrangler dev --env production
```

---

## Deployment

### Manual Deployment

Deploy to staging:

```bash
wrangler deploy --env staging
```

Deploy to production:

```bash
wrangler deploy --env production
```

### Automated Deployment (GitHub Actions)

The repository is configured for automated deployments:

- **Staging**: Automatically deploys when you push to `reflexhon-cloud-v1` branch
- **Production**: Automatically deploys when you push to `main` branch

The workflow is defined in `.github/workflows/deploy-cloudflare.yml`.

### Deployment Workflow

1. Push code to `reflexhon-cloud-v1` (staging) or `main` (production)
2. GitHub Actions runs tests and linting
3. If tests pass, deploys to the corresponding environment
4. Check the Actions tab in GitHub for deployment status

---

## Troubleshooting

### Issue: `wrangler` command not found

**Solution**: Install Wrangler globally:

```bash
npm install -g wrangler
```

### Issue: Authentication failed

**Solution**: Re-authenticate with Cloudflare:

```bash
wrangler logout
wrangler login
```

### Issue: Deployment fails with "Invalid binding"

**Solution**: Verify that all placeholder IDs in `wrangler.toml` are replaced with actual resource IDs.

### Issue: Routes not working

**Solution**:
1. Verify domain DNS is pointing to Cloudflare
2. Check that routes are configured in Cloudflare Dashboard
3. Ensure `zone_name` in `wrangler.toml` matches your domain

### Issue: GitHub Actions deployment fails

**Solution**:
1. Verify GitHub secrets are correctly configured
2. Check that `CLOUDFLARE_API_TOKEN` has proper permissions
3. Review the Actions logs for specific error messages

### Issue: Tests failing in CI/CD

**Solution**:
1. Run tests locally: `npm test`
2. Fix any failing tests before pushing
3. Ensure all dependencies are in `package.json`

---

## Environment-Specific Notes

### Development
- Uses debug logging
- No external resources required
- Hot reload enabled with nodemon

### Staging
- Info-level logging
- Uses staging D1 database and KV cache
- Accessible at `https://staging-api.reflexhon.cloud`

### Production
- Warning-level logging only
- Uses production D1 database and KV cache
- Accessible at `https://api.reflexhon.cloud`
- Protected by additional GitHub environment approval (optional)

---

## Security Best Practices

1. **Never commit** `.env` files or secrets to Git
2. **Rotate** API tokens regularly (every 90 days recommended)
3. **Use environment-specific** databases (never share production data with staging)
4. **Enable branch protection** on `main` to require pull request reviews
5. **Monitor** Cloudflare analytics for unusual traffic patterns

---

## Next Steps

After completing this setup:

1. Review the [API Documentation](../API.md)
2. Check the [Architecture Overview](../ARCHITECTURE.md)
3. Read the project [README](../../README.md)
4. Explore the [CLAUDE.md](../../CLAUDE.md) development guide

---

## Support

For issues or questions:
- Check existing GitHub Issues
- Review Cloudflare Workers documentation
- Consult the [Wrangler CLI docs](https://developers.cloudflare.com/workers/wrangler/)

---

**Last Updated**: December 2025
**Version**: 1.0.0
