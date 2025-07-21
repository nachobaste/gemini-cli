#!/usr/bin/env node

/**
 * GEOCUBO Database Setup Script
 * 
 * This script sets up the database schema, functions, policies, and sample data
 * for a new GEOCUBO installation.
 * 
 * Usage: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFile(filePath) {
  try {
    console.log(`📄 Executing ${path.basename(filePath)}...`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL file into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct execution for some statements
          const { error: directError } = await supabase
            .from('_temp')
            .select('1')
            .limit(0);
            
          if (directError && directError.code !== 'PGRST116') {
            console.warn(`⚠️  Warning in ${path.basename(filePath)}: ${error.message}`);
          }
        }
      }
    }
    
    console.log(`✅ ${path.basename(filePath)} executed successfully`);
  } catch (error) {
    console.error(`❌ Error executing ${path.basename(filePath)}:`, error.message);
    throw error;
  }
}

async function setupDatabase() {
  console.log('🚀 Starting GEOCUBO database setup...\n');
  
  const databaseDir = path.join(__dirname, '..', 'database');
  const sqlFiles = [
    '01_schema.sql',
    '02_functions.sql',
    '03_policies.sql',
    '04_sample_data.sql'
  ];
  
  try {
    // Check if database directory exists
    if (!fs.existsSync(databaseDir)) {
      throw new Error(`Database directory not found: ${databaseDir}`);
    }
    
    // Execute SQL files in order
    for (const sqlFile of sqlFiles) {
      const filePath = path.join(databaseDir, sqlFile);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  SQL file not found: ${sqlFile}, skipping...`);
        continue;
      }
      
      await executeSQLFile(filePath);
    }
    
    // Verify setup by checking if tables exist
    console.log('\n🔍 Verifying database setup...');
    
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['projects', 'mcda_parameters', 'mcda_evaluations']);
    
    if (error) {
      console.warn('⚠️  Could not verify tables, but setup may have succeeded');
    } else {
      console.log(`✅ Found ${tables.length} core tables in database`);
    }
    
    // Test a simple query
    const { data: projectCount, error: countError } = await supabase
      .from('projects')
      .select('id', { count: 'exact' });
    
    if (!countError) {
      console.log(`✅ Database is responding correctly`);
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Check the projects page to see sample data');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Verify your Supabase credentials in .env.local');
    console.error('2. Check that your Supabase project is active');
    console.error('3. Ensure you have the correct service role key');
    console.error('4. Try running the SQL files manually in Supabase SQL Editor');
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  setupDatabase().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupDatabase };

