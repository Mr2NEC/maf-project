import { existsSync } from 'fs';
import { DataSource } from 'typeorm';
import { DatabaseConfig, databaseConfig } from './config/database.config';
import { buildTypeOrmOptions } from './config/typeorm.options';

/**
 * DataSource for the TypeORM CLI (migrations). Runs outside Nest, so it
 * loads backend/.env itself; inside docker the variables come from compose.
 *
 *   npm run migration:generate -- src/migrations/<Name>
 *   npm run migration:run
 */
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default new DataSource({
  // registerAs factories are synchronous here
  ...buildTypeOrmOptions(databaseConfig() as DatabaseConfig),
  // The CLI must only apply migrations, never sync the schema
  synchronize: false,
});
