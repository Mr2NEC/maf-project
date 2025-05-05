import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  name: process.env.MYSQL_DATABASE,
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
}));
