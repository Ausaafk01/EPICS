import fs from 'fs';
import path from 'path';
import { getPool, closePool } from '../src/core/database/connection';
import { logger } from '../src/core/utils/logger';

async function runSeed() {
  const seedsDir = path.resolve(__dirname, '../../docs/architecture/seeds');
  logger.info(`Starting database seeding from: ${seedsDir}`);

  if (!fs.existsSync(seedsDir)) {
    logger.error(`Seeds directory does not exist at: ${seedsDir}`);
    process.exit(1);
  }

  const sqlFiles = fs
    .readdirSync(seedsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (sqlFiles.length === 0) {
    logger.error(`No seed files found in: ${seedsDir}`);
    process.exit(1);
  }

  logger.info(`Found ${sqlFiles.length} seed file(s) to execute in sequence:`, { files: sqlFiles });

  const pool = getPool();
  const client = await pool.connect();

  try {
    logger.info('Acquired client connection. Executing seed scripts within transaction...');
    await client.query('BEGIN');

    for (const file of sqlFiles) {
      const filePath = path.join(seedsDir, file);
      logger.info(`Executing seed file: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
    }

    await client.query('COMMIT');
    logger.info('Database seeding completed successfully! Master jurisdiction data populated.');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Database seeding failed! Rolled back changes.', { error: (err as Error).message });
    process.exit(1);
  } finally {
    client.release();
    await closePool();
  }
}

runSeed().catch((err) => {
  console.error('Unhandled seeding error:', err);
  process.exit(1);
});
