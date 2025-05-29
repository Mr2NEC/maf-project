import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
}

export const databaseConfig = registerAs<DatabaseConfig>('database', () => ({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  username: process.env.MYSQL_USER || 'maf',
  password: process.env.MYSQL_PASSWORD || 'password',
  name: process.env.MYSQL_DATABASE || 'maf_db',
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
}));
