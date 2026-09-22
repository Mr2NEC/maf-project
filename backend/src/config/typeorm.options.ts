import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from './database.config';

/**
 * Single source of TypeORM options for the app, CLI scripts and migrations.
 * Globs are relative to this file so they work from both src (ts) and dist (js).
 */
export function buildTypeOrmOptions(db: DatabaseConfig): DataSourceOptions {
  return {
    type: 'mysql',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.name,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: db.synchronize,
    extra: { connectionLimit: 5 },
  };
}
