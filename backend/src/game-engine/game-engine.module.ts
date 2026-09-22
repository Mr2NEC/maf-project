import { Module } from '@nestjs/common';
import { GamesModule } from 'src/games/games.module';
import { GameEngineResolver } from './game-engine.resolver';
import { GameEngineService } from './game-engine.service';

@Module({
  imports: [GamesModule],
  providers: [GameEngineResolver, GameEngineService],
})
export class GameEngineModule {}
