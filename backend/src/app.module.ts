import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
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
import { SharedModule } from './shared/shared.module';

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
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    PlayersModule,
    PlacesModule,
    ClubsModule,
    ClubOwnersModule,
    SocialsModule,
    DataInitializerModule,
    GamesModule,
    UsersModule,
    RolesModule,
    RoleActionsModule,
    ActionsModule,
    ActionTypesModule,
    ActionTargetsModule,
    GameTypesModule,
    GameTypeRolesModule,
    SharedModule,
  ],
})
export class AppModule {}
