import { Module } from '@nestjs/common';
import { ClubMembersModule } from 'src/club-members/club-members.module';
import { GamesModule } from 'src/games/games.module';
import { RatingModule } from 'src/rating/rating.module';
import { GameEngineResolver } from './game-engine.resolver';
import { GameEngineService } from './game-engine.service';

@Module({
  imports: [GamesModule, ClubMembersModule, RatingModule],
  providers: [GameEngineResolver, GameEngineService],
})
export class GameEngineModule {}
