import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

/**
 * Migration runner for Vercel Postgres
 * Reads SQL files from this directory and executes them
 */

async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    // Read all SQL files in order
    const scriptsDir = __dirname;
    const sqlFiles = fs
      .readdirSync(scriptsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (sqlFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }

    console.log(`Found ${sqlFiles.length} migration(s).`);

    for (const file of sqlFiles) {
      const filePath = path.join(scriptsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      console.log(`\nRunning migration: ${file}`);

      // Split by semicolon to handle multiple statements
      const statements = sqlContent
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        try {
          await sql.query(statement);
          console.log(`✓ Executed: ${statement.substring(0, 60)}...`);
        } catch (error) {
          console.error(`✗ Error executing statement:`, error);
          throw error;
        }
      }

      console.log(`✓ Migration ${file} completed.`);
    }

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
