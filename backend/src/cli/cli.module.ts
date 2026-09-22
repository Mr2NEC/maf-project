import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig, databaseConfig } from 'src/config/database.config';
import { validateEnv } from 'src/config/env.validation';
import { buildTypeOrmOptions } from 'src/config/typeorm.options';
import { DataInitializerModule } from 'src/data-initializer/data-initializer.module';

/** Minimal context for CLI scripts: config + database, no HTTP/GraphQL. */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...buildTypeOrmOptions(
          configService.getOrThrow<DatabaseConfig>('database'),
        ),
        // Scripts must never change the schema
        synchronize: false,
      }),
    }),
    DataInitializerModule,
  ],
})
export class CliModule {}
