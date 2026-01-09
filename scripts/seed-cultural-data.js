// Seed Cultural Data Script
// Imports Papiamentu cultural datasets from JSONL file to D1 database

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load JSONL data from file
 * @param {string} filePath - Path to JSONL file
 * @returns {Array<Object>} Parsed datasets
 */
function loadJSONL(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    console.error('Error loading JSONL file:', error);
    return [];
  }
}

/**
 * Generate SQL INSERT statements from datasets
 * @param {Array<Object>} datasets - Dataset objects
 * @returns {string} SQL INSERT statements
 */
function generateInsertSQL(datasets) {
  const sqlStatements = [];

  for (const dataset of datasets) {
    const id = dataset.id;
    const input = dataset.input.replace(/'/g, "''"); // Escape single quotes
    const output = dataset.output.replace(/'/g, "''");
    const category = dataset.category || 'general';
    const language = dataset.language || 'papiamentu';
    const culturalContext = dataset.cultural_context || 'caribbean';
    const tags = dataset.tags ? JSON.stringify(dataset.tags).replace(/'/g, "''") : null;
    const source = dataset.source || 'initial_seed';

    const sql = `
INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  '${id}',
  '${input}',
  '${output}',
  '${category}',
  '${language}',
  '${culturalContext}',
  ${tags ? `'${tags}'` : 'NULL'},
  '${source}',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);`.trim();

    sqlStatements.push(sql);
  }

  return sqlStatements.join('\n\n');
}

/**
 * Main seed function
 */
async function main() {
  console.log('🌴 Reflexhon Global - Cultural Data Seeding');
  console.log('='.repeat(50));

  // Load datasets from JSONL
  const dataPath = join(process.cwd(), 'ai', 'datasets', 'data.jsonl');
  console.log(`📂 Loading data from: ${dataPath}`);

  const datasets = loadJSONL(dataPath);
  console.log(`✅ Loaded ${datasets.length} cultural datasets`);

  if (datasets.length === 0) {
    console.error('❌ No datasets found!');
    process.exit(1);
  }

  // Generate SQL
  console.log('\n📝 Generating SQL INSERT statements...');
  const sql = generateInsertSQL(datasets);

  // Write to migration file
  const migrationPath = join(process.cwd(), 'migrations', '0002_seed_cultural_datasets.sql');
  const fs = await import('fs/promises');

  const migrationContent = `-- Migration: 0002_seed_cultural_datasets
-- Description: Seed initial Papiamentu cultural datasets
-- Created: ${new Date().toISOString()}
-- Count: ${datasets.length} datasets
-- ============================================================================

-- Categories: ${[...new Set(datasets.map(d => d.category))].join(', ')}

-- Delete existing seed data (if re-running)
DELETE FROM cultural_datasets WHERE source = 'initial_seed';

-- Insert cultural datasets
${sql}

-- Verify import
SELECT
  category,
  COUNT(*) as count
FROM cultural_datasets
WHERE source = 'initial_seed'
GROUP BY category;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
`;

  await fs.writeFile(migrationPath, migrationContent, 'utf-8');
  console.log(`✅ Migration file created: ${migrationPath}`);

  // Print summary
  console.log('\n📊 Dataset Summary:');
  const categories = {};
  datasets.forEach(d => {
    categories[d.category] = (categories[d.category] || 0) + 1;
  });

  Object.entries(categories).forEach(([category, count]) => {
    console.log(`   ${category}: ${count}`);
  });

  console.log('\n🚀 Next Steps:');
  console.log('   1. Create D1 database:');
  console.log('      wrangler d1 create reflexhon_global');
  console.log('');
  console.log('   2. Update wrangler.toml with database_id');
  console.log('');
  console.log('   3. Run migrations:');
  console.log('      wrangler d1 execute reflexhon_global --file=./migrations/0001_initial_schema.sql --remote');
  console.log('      wrangler d1 execute reflexhon_global --file=./migrations/0002_seed_cultural_datasets.sql --remote');
  console.log('');
  console.log('   4. Verify data:');
  console.log('      wrangler d1 execute reflexhon_global --command "SELECT COUNT(*) FROM cultural_datasets" --remote');
  console.log('');
  console.log('✨ Bon suerte! (Good luck!)');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { loadJSONL, generateInsertSQL };
