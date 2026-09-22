import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMembersModule } from 'src/club-members/club-members.module';
import { Game } from 'src/games/entities/game.entity';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentsResolver } from './tournaments.resolver';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      TournamentParticipant,
      Player,
      Game,
      User,
    ]),
    ClubMembersModule,
  ],
  providers: [TournamentsResolver, TournamentsService],
  exports: [TournamentsService],
})
export class TournamentsModule {}
