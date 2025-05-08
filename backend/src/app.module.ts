import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayersModule } from './players/players.module';
import { graphqlConfig } from './config/graphql.config';
import { databaseConfig } from './config/database.config';
import { PlacesModule } from './places/places.module';
import { ClubsModule } from './clubs/clubs.module';
import { ClubOwnersModule } from './club-owners/club-owners.module';
import { SocialsModule } from './socials/socials.module';
import { DataInitializerModule } from './data-initializer/data-initializer.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, graphqlConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: true,
        verboseRetryLog: true,
        extra: {
          connectionLimit: 5,
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: configService.get<boolean>('graphql.debug'),
        playground: configService.get<boolean>('graphql.playground'),
        introspection: configService.get<boolean>('graphql.introspection'),
        autoSchemaFile: configService.get<string>('graphql.autoSchemaFile'),
        sortSchema: configService.get<boolean>('graphql.sortSchema'),
        path: configService.get<string>('graphql.path'),
        cors: configService.get<boolean>('graphql.cors'),
        context: configService.get<boolean>('graphql.context'),
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
    DataInitializerModule,
    GamesModule,
    UsersModule,
    ActionsModule,
    ActionTypesModule,
    ActionTargetsModule,
    CommonModule,
  ],
})
export class AppModule {}
