const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const runMigration = async () => {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Please provide a migration file to run.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log(`Attempting to connect to the database...`);
    await client.connect();
    console.log('Database connection successful.');
    const sql = fs.readFileSync(path.join(__dirname, '../database', migrationFile), 'utf8');
    await client.query(sql);
    console.log(`Migration ${migrationFile} successful!`);
  } catch (err) {
    console.error(`Migration ${migrationFile} failed:`, err);
  } finally {
    await client.end();
  }
};

runMigration();