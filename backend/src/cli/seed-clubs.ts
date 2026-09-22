import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataInitializerService } from 'src/data-initializer/data-initializer.service';
import { CliModule } from './cli.module';

/**
 * Imports clubs from a JSON list.
 * Usage: npm run seed:clubs -- <url>   (or set DATA_INIT_CLUBS)
 */
async function main() {
  const logger = new Logger('seed:clubs');
  const sourceUrl = process.argv[2] ?? process.env.DATA_INIT_CLUBS;
  if (!sourceUrl) {
    logger.error('Pass the source URL as an argument or set DATA_INIT_CLUBS');
    process.exitCode = 1;
    return;
  }

  const app = await NestFactory.createApplicationContext(CliModule);
  try {
    await app.get(DataInitializerService).initializeClubs(sourceUrl);
  } catch (error) {
    logger.error(error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void main();
