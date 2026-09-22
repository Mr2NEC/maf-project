import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
}

// Values are guaranteed by validateEnv (config/env.validation.ts)
export const databaseConfig = registerAs<DatabaseConfig>('database', () => ({
  host: process.env.MYSQL_HOST as string,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  username: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  name: process.env.MYSQL_DATABASE as string,
  synchronize: process.env.NODE_ENV === 'development',
}));
