#!/bin/bash

# Reflexhon Cloud - Cloudflare Resources Setup Script
# This script helps you create and configure Cloudflare resources

set -e

echo "=================================================="
echo "  Reflexhon Cloud - Cloudflare Setup Helper"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}Error: Wrangler CLI is not installed${NC}"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

echo -e "${GREEN}✓ Wrangler CLI found${NC}"
echo ""

# Check if user is logged in
echo -e "${BLUE}Checking Wrangler authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}You need to login to Cloudflare first${NC}"
    echo "Running: wrangler login"
    wrangler login
else
    echo -e "${GREEN}✓ Already authenticated${NC}"
fi
echo ""

# Create output file
OUTPUT_FILE="cloudflare-resources-ids.txt"
echo "# Cloudflare Resources IDs" > "$OUTPUT_FILE"
echo "# Generated: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${BLUE}Step 1: Creating D1 Databases...${NC}"
echo ""

# Create staging database
echo "Creating staging database..."
STAGING_DB_OUTPUT=$(wrangler d1 create reflexhon_staging 2>&1 || echo "EXISTS")

if [[ "$STAGING_DB_OUTPUT" == *"EXISTS"* ]] || [[ "$STAGING_DB_OUTPUT" == *"already exists"* ]]; then
    echo -e "${YELLOW}⚠ Staging database already exists${NC}"
    echo "Run 'wrangler d1 list' to see existing databases"
else
    STAGING_DB_ID=$(echo "$STAGING_DB_OUTPUT" | grep -oP 'database_id = "\K[^"]+' || echo "NOT_FOUND")
    echo -e "${GREEN}✓ Staging database created${NC}"
    echo "Database ID: $STAGING_DB_ID"
    echo "STAGING_DB_ID=$STAGING_DB_ID" >> "$OUTPUT_FILE"
fi
echo ""

# Create production database
echo "Creating production database..."
PROD_DB_OUTPUT=$(wrangler d1 create reflexhon_production 2>&1 || echo "EXISTS")

if [[ "$PROD_DB_OUTPUT" == *"EXISTS"* ]] || [[ "$PROD_DB_OUTPUT" == *"already exists"* ]]; then
    echo -e "${YELLOW}⚠ Production database already exists${NC}"
    echo "Run 'wrangler d1 list' to see existing databases"
else
    PROD_DB_ID=$(echo "$PROD_DB_OUTPUT" | grep -oP 'database_id = "\K[^"]+' || echo "NOT_FOUND")
    echo -e "${GREEN}✓ Production database created${NC}"
    echo "Database ID: $PROD_DB_ID"
    echo "PROD_DB_ID=$PROD_DB_ID" >> "$OUTPUT_FILE"
fi
echo ""

echo -e "${BLUE}Step 2: Creating KV Namespaces...${NC}"
echo ""

# Create staging KV namespace
echo "Creating staging KV namespace..."
STAGING_KV_OUTPUT=$(wrangler kv:namespace create "CACHE" --env staging 2>&1 || echo "EXISTS")

if [[ "$STAGING_KV_OUTPUT" == *"EXISTS"* ]] || [[ "$STAGING_KV_OUTPUT" == *"already exists"* ]]; then
    echo -e "${YELLOW}⚠ Staging KV namespace already exists${NC}"
    echo "Run 'wrangler kv:namespace list' to see existing namespaces"
else
    STAGING_KV_ID=$(echo "$STAGING_KV_OUTPUT" | grep -oP 'id = "\K[^"]+' || grep -oP 'id = \K[a-f0-9]+' || echo "NOT_FOUND")
    echo -e "${GREEN}✓ Staging KV namespace created${NC}"
    echo "Namespace ID: $STAGING_KV_ID"
    echo "STAGING_KV_ID=$STAGING_KV_ID" >> "$OUTPUT_FILE"
fi
echo ""

# Create production KV namespace
echo "Creating production KV namespace..."
PROD_KV_OUTPUT=$(wrangler kv:namespace create "CACHE" --env production 2>&1 || echo "EXISTS")

if [[ "$PROD_KV_OUTPUT" == *"EXISTS"* ]] || [[ "$PROD_KV_OUTPUT" == *"already exists"* ]]; then
    echo -e "${YELLOW}⚠ Production KV namespace already exists${NC}"
    echo "Run 'wrangler kv:namespace list' to see existing namespaces"
else
    PROD_KV_ID=$(echo "$PROD_KV_OUTPUT" | grep -oP 'id = "\K[^"]+' || grep -oP 'id = \K[a-f0-9]+' || echo "NOT_FOUND")
    echo -e "${GREEN}✓ Production KV namespace created${NC}"
    echo "Namespace ID: $PROD_KV_ID"
    echo "PROD_KV_ID=$PROD_KV_ID" >> "$OUTPUT_FILE"
fi
echo ""

echo "=================================================="
echo -e "${GREEN}Resource Creation Complete!${NC}"
echo "=================================================="
echo ""

echo -e "${BLUE}Resource IDs have been saved to: ${YELLOW}$OUTPUT_FILE${NC}"
echo ""

# List all resources
echo -e "${BLUE}Current D1 Databases:${NC}"
wrangler d1 list || echo "Unable to list databases"
echo ""

echo -e "${BLUE}Current KV Namespaces:${NC}"
wrangler kv:namespace list || echo "Unable to list namespaces"
echo ""

echo "=================================================="
echo -e "${YELLOW}Next Steps:${NC}"
echo "=================================================="
echo ""
echo "1. Check the file: $OUTPUT_FILE"
echo "2. Update wrangler.toml with the IDs from that file"
echo "3. Get your Account ID from: https://dash.cloudflare.com"
echo "4. Create an API Token from: https://dash.cloudflare.com/profile/api-tokens"
echo "5. Add GitHub secrets: CLOUDFLARE_API_TOKEN and CF_ACCOUNT_ID"
echo ""
echo "📖 For detailed instructions, see: docs/guides/CLOUDFLARE_QUICKSTART.md"
echo ""
echo -e "${GREEN}Done!${NC}"
