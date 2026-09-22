import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { EntityNotFoundFilter } from './entity-not-found/entity-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  // Lets rate limits see the visitor IP forwarded by the Next.js server
  if (process.env.TRUST_PROXY) {
    app.set('trust proxy', process.env.TRUST_PROXY);
  }
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  await app.listen(process.env.BACKEND_PORT ?? 4000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
