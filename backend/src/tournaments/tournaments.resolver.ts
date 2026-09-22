import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { TournamentStatus } from 'src/enums/tournament-status.enum';
import { Game } from 'src/games/entities/game.entity';
import { TournamentStanding } from './dto/standing';
import {
  CreateTournamentInput,
  UpdateTournamentInput,
} from './dto/tournament.inputs';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { Tournament } from './entities/tournament.entity';
import { TournamentsService } from './tournaments.service';

@Resolver(() => Tournament)
export class TournamentsResolver {
  constructor(private readonly service: TournamentsService) {}

  @Public()
  @Query(() => [Tournament])
  tournaments(
    @Args() pagination: PaginationArgs,
    @Args('clubId', { type: () => Int, nullable: true }) clubId?: number,
    @Args('statuses', { type: () => [TournamentStatus], nullable: true })
    statuses?: TournamentStatus[],
  ) {
    return this.service.findAll(pagination, { clubId, statuses });
  }

  @Public()
  @Query(() => Tournament)
  tournament(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @ResolveField('participants', () => [TournamentParticipant])
  participants(@Parent() tournament: Tournament) {
    return this.service.participantsOf(tournament.id);
  }

  @ResolveField('games', () => [Game])
  games(@Parent() tournament: Tournament) {
    return this.service.gamesOf(tournament.id);
  }

  @ResolveField('standings', () => [TournamentStanding])
  standings(@Parent() tournament: Tournament) {
    return this.service.standings(tournament.id);
  }

  @Mutation(() => Tournament)
  createTournament(
    @CurrentUser() user: JwtUser,
    @Args('input') input: CreateTournamentInput,
  ) {
    return this.service.create(user, input);
  }

  @Mutation(() => Tournament)
  updateTournament(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateTournamentInput,
  ) {
    return this.service.update(user, id, input);
  }

  @Mutation(() => Boolean)
  deleteTournament(
    @CurrentUser() user: JwtUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.service.remove(user, id);
  }

  @Mutation(() => [TournamentParticipant])
  addTournamentParticipant(
    @CurrentUser() user: JwtUser,
    @Args('tournamentId', { type: () => Int }) tournamentId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.service.addParticipant(user, tournamentId, userId);
  }

  @Mutation(() => [TournamentParticipant])
  removeTournamentParticipant(
    @CurrentUser() user: JwtUser,
    @Args('tournamentId', { type: () => Int }) tournamentId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.service.removeParticipant(user, tournamentId, userId);
  }
}
