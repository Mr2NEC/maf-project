import { Module } from '@nestjs/common';
import { GameTypeRolesService } from './game-type-roles.service';
import { GameTypeRolesResolver } from './game-type-roles.resolver';
import { GameTypeRole } from './entities/game-type-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameTypesModule } from 'src/game-types/game-types.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameTypeRole]),
    GameTypesModule,
    RolesModule,
  ],
  providers: [GameTypeRolesResolver, GameTypeRolesService],
  exports: [GameTypeRolesService],
})
export class GameTypeRolesModule {}
