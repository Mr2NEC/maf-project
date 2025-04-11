import { Module } from '@nestjs/common';
import { GameTypesService } from './game-types.service';
import { GameTypesResolver } from './game-types.resolver';
import { GameType } from './entities/game-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { GameTypeRolesModule } from 'src/game-type-roles/game-type-roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameType]),
    RolesModule,
    GameTypeRolesModule,
  ],
  providers: [GameTypesResolver, GameTypesService],
  exports: [GameTypesService],
})
export class GameTypesModule {}
