import { Module } from '@nestjs/common';
import { GameTypeRole } from './entities/game-type-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameTypeRolesResolver } from './game-type-roles.resolver';
import { GameTypeRolesService } from './game-type-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameTypeRole])],
  providers: [GameTypeRolesResolver, GameTypeRolesService],
  exports: [GameTypeRolesService],
})
export class GameTypeRolesModule {}
