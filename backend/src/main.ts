import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundFilter } from './entity-not-found/entity-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.BACKEND_PORT ?? 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
