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
  host: process.env.MYSQL_HOST || 'mysql',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  name: process.env.MYSQL_DATABASE || 'maf',
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
}));
