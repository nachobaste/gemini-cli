const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const runMigration = async () => {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Please provide a migration file to run.');
    process.exit(1);
  }

  let dbUrl;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
    const match = envFile.match(/^DATABASE_URL=(.*)$/m);
    if (match && match[1]) {
      dbUrl = match[1];
    } else {
      throw new Error('DATABASE_URL not found in .env.local');
    }
  } catch (err) {
    console.error('Error reading .env.local file:', err);
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
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
