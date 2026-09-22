import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayersModule } from './players/players.module';
import { graphqlConfig } from './config/graphql.config';
import { DatabaseConfig, databaseConfig } from './config/database.config';
import { buildTypeOrmOptions } from './config/typeorm.options';
import { PlacesModule } from './places/places.module';
import { ClubsModule } from './clubs/clubs.module';
import { ClubOwnersModule } from './club-owners/club-owners.module';
import { SocialsModule } from './socials/socials.module';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { RoleActionsModule } from './role-actions/role-actions.module';
import { ActionsModule } from './actions/actions.module';
import { ActionTypesModule } from './action-types/action-types.module';
import { ActionTargetsModule } from './action-targets/action-targets.module';
import { GameTypesModule } from './game-types/game-types.module';
import { GameTypeRolesModule } from './game-type-roles/game-type-roles.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GameEngineModule } from './game-engine/game-engine.module';
import { RatingModule } from './rating/rating.module';
import { jwtConfig } from './config/jwt.config';
import { validateEnv } from './config/env.validation';
import depthLimit = require('graphql-depth-limit');
import { LoggerModule } from 'nestjs-pino';
import { formatGraphQLError } from './common/graphql/format-error';

// Deep nesting (game -> players -> user -> players -> ...) is a cheap DoS vector
const MAX_QUERY_DEPTH = 8;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, graphqlConfig, jwtConfig],
      validate: validateEnv,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : { target: 'pino-pretty', options: { singleLine: true } },
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...buildTypeOrmOptions(
          configService.getOrThrow<DatabaseConfig>('database'),
        ),
        autoLoadEntities: true,
        verboseRetryLog: true,
        // Apply pending migrations on startup
        migrationsRun: true,
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        debug: configService.get<boolean>('graphql.debug'),
        formatError: (formatted, error) =>
          formatGraphQLError(
            formatted,
            configService.get<boolean>('graphql.debug') ?? false,
            error,
          ),
        validationRules: [depthLimit(MAX_QUERY_DEPTH)],
        // GraphQL Playground is not compatible with Apollo Server 5; use Apollo Sandbox instead
        playground: false,
        plugins: configService.get<boolean>('graphql.playground')
          ? [ApolloServerPluginLandingPageLocalDefault()]
          : [],
        introspection: configService.get<boolean>('graphql.introspection'),
        autoSchemaFile: configService.get<string>('graphql.autoSchemaFile'),
        sortSchema: configService.get<boolean>('graphql.sortSchema'),
        path: configService.get<string>('graphql.path'),
        cors: configService.get<boolean>('graphql.cors'),
        context: ({ req, res }) => ({ req, res }),
      }),
      inject: [ConfigService],
    }),
    PlayersModule,
    RolesModule,
    RoleActionsModule,
    GameTypesModule,
    GameTypeRolesModule,
    PlacesModule,
    ClubsModule,
    ClubOwnersModule,
    SocialsModule,
    GamesModule,
    UsersModule,
    ActionsModule,
    ActionTypesModule,
    ActionTargetsModule,
    CommonModule,
    AuthModule,
    ProfilesModule,
    GameEngineModule,
    RatingModule,
  ],
})
export class AppModule {}
