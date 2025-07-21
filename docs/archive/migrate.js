#!/usr/bin/env node

/**
 * GEOCUBO Database Migration Script
 * 
 * This script handles database migrations for the GEOCUBO application.
 * It reads migration files from the database/ directory and applies them
 * to the Supabase database in order.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  const migrationsDir = path.join(__dirname, '..', 'database');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Database migrations directory not found:', migrationsDir);
    process.exit(1);
  }

  // Get all SQL files in order
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found.');
    return;
  }

  console.log(`📁 Found ${migrationFiles.length} migration files:`);
  migrationFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');

  // Create migrations table if it doesn't exist
  const { error: createTableError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (createTableError) {
    console.error('❌ Failed to create migrations table:', createTableError.message);
    process.exit(1);
  }

  // Get already executed migrations
  const { data: executedMigrations, error: fetchError } = await supabase
    .from('migrations')
    .select('filename');

  if (fetchError) {
    console.error('❌ Failed to fetch executed migrations:', fetchError.message);
    process.exit(1);
  }

  const executedFilenames = new Set(executedMigrations?.map(m => m.filename) || []);

  // Execute pending migrations
  for (const filename of migrationFiles) {
    if (executedFilenames.has(filename)) {
      console.log(`⏭️  Skipping ${filename} (already executed)`);
      continue;
    }

    console.log(`🔄 Executing ${filename}...`);
    
    const filePath = path.join(migrationsDir, filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    try {
      // Execute each statement
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          throw error;
        }
      }

      // Record successful migration
      const { error: recordError } = await supabase
        .from('migrations')
        .insert({ filename });

      if (recordError) {
        throw recordError;
      }

      console.log(`✅ Successfully executed ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to execute ${filename}:`, error.message);
      process.exit(1);
    }
  }

  console.log('');
  console.log('🎉 All migrations completed successfully!');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
GEOCUBO Database Migration Script

Usage:
  node scripts/migrate.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be executed without running migrations

Environment Variables:
  NEXT_PUBLIC_SUPABASE_URL      Your Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY     Your Supabase service role key

Examples:
  node scripts/migrate.js
  node scripts/migrate.js --dry-run
`);
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🔍 Dry run mode - showing what would be executed...');
  
  const migrationsDir = path.join(__dirname, '..', 'database');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`📁 Would execute ${migrationFiles.length} migration files:`);
  migrationFiles.forEach(file => console.log(`   - ${file}`));
  
  process.exit(0);
}

// Run migrations
runMigrations().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

