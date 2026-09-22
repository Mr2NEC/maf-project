import { ClubMembersModule } from 'src/club-members/club-members.module';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Module, forwardRef } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameTypesModule } from 'src/game-types/game-types.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Tournament]),
    ClubMembersModule,
    GameTypesModule,
    forwardRef(() => PlayersModule),
  ],
  providers: [GamesResolver, GamesService],
  exports: [GamesService],
})
export class GamesModule {}
