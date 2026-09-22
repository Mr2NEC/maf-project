/**
 * Defaults for e2e tests. They need a MySQL server; the database named here
 * is dropped and recreated by every run, so never point it at real data.
 * Locally: `make db-up` (port 3307, credentials from .env.dev).
 */
const defaults: Record<string, string> = {
  NODE_ENV: 'test',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3307',
  MYSQL_USER: 'maf',
  MYSQL_DATABASE: 'maf_e2e',
  JWT_SECRET: 'e2e-secret-that-is-at-least-32-characters-long',
  JWT_EXPIRES_IN: '15m',
  GRAPHQL_SCHEMA_PATH: 'src/schema.gql',
};

for (const [key, value] of Object.entries(defaults)) {
  process.env[key] ??= value;
}

if (!process.env.MYSQL_DATABASE?.includes('e2e')) {
  throw new Error('e2e tests drop the database: its name must contain "e2e"');
}
