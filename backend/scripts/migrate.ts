import fs from 'fs';
import path from 'path';
import { getPool, closePool } from '../src/core/database/connection';
import { logger } from '../src/core/utils/logger';

async function runMigration() {
  const schemaDir = path.resolve(__dirname, '../../docs/architecture/schema');
  logger.info(`Starting modular database schema migration from: ${schemaDir}`);

  if (!fs.existsSync(schemaDir)) {
    logger.error(`Schema directory does not exist at: ${schemaDir}`);
    process.exit(1);
  }

  const sqlFiles = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (sqlFiles.length === 0) {
    logger.error(`No SQL schema files found in: ${schemaDir}`);
    process.exit(1);
  }

  logger.info(`Found ${sqlFiles.length} schema files to execute in sequence:`, { files: sqlFiles });

  const pool = getPool();
  const client = await pool.connect();

  try {
    logger.info('Acquired client connection. Executing modular DDL within transaction...');
    await client.query('BEGIN');

    for (const file of sqlFiles) {
      const filePath = path.join(schemaDir, file);
      logger.info(`Executing schema file: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
    }

    await client.query('COMMIT');
    logger.info('Modular migration completed successfully! All tables, indexes, and constraints applied.');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Migration failed! Rolled back changes.', { error: (err as Error).message });
    process.exit(1);
  } finally {
    client.release();
    await closePool();
  }
}

runMigration().catch((err) => {
  console.error('Unhandled migration error:', err);
  process.exit(1);
});
