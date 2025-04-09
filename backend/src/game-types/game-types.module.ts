import { Module } from '@nestjs/common';
import { GameTypesService } from './game-types.service';
import { GameTypesResolver } from './game-types.resolver';
import { GameType } from './entities/game-type.entity';
import { GameTypeRolesModule } from 'src/game-type-roles/game-type-roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GameType]), GameTypeRolesModule],
  providers: [GameTypesResolver, GameTypesService],
  exports: [GameTypesService],
})
export class GameTypesModule {}
