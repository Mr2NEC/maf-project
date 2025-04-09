import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameTypesModule } from 'src/game-types/game-types.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), GameTypesModule],
  providers: [GamesResolver, GamesService],
  exports: [GamesService],
})
export class GamesModule {}
