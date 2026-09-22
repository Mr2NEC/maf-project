import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, In, MoreThanOrEqual, Repository } from 'typeorm';
import { JwtUser } from 'src/auth/types/jwt-user';
import { ClubAccessService } from 'src/club-members/club-access.service';
import { DateUtils } from 'src/common/utils/date.utils';
import { GameStatus } from 'src/enums/game-status.enum';
import { TournamentStatus } from 'src/enums/tournament-status.enum';
import { GameTypesService } from 'src/game-types/game-types.service';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { CreateGameInput } from './dto/create-game.input';
import { GamesFilterArgs } from './dto/games-filter.args';
import { UpdateGameInput } from './dto/update-game.input';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    @InjectRepository(Tournament)
    private readonly tournaments: Repository<Tournament>,
    private readonly gameTypesService: GameTypesService,
    private readonly access: ClubAccessService,
  ) {}

  findAll({
    skip,
    take,
    statuses,
    from,
    clubId,
    tournamentId,
  }: GamesFilterArgs): Promise<Game[]> {
    return this.gamesRepository.find({
      where: {
        ...(statuses?.length && { status: In(statuses) }),
        ...(from && { startDate: MoreThanOrEqual(from) }),
        ...(clubId !== undefined && { clubId }),
        ...(tournamentId !== undefined && { tournamentId }),
      },
      relations: [
        'gameType',
        'club',
        'tournament',
        'players',
        'players.user',
        'players.role',
      ],
      // Upcoming games soonest first, otherwise newest first
      order: from
        ? { startDate: 'ASC', id: 'ASC' }
        : { startDate: 'DESC', id: 'DESC' },
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id },
      relations: [
        'gameType',
        'gameType.gameTypeRoles',
        'gameType.gameTypeRoles.role',
        'club',
        'tournament',
        'players',
        'players.user',
        'players.role',
      ],
      order: { players: { seatNumber: 'ASC' } },
    });
    if (!game) {
      throw new EntityNotFoundError(Game, { id });
    }
    return game;
  }

  async create(user: JwtUser, input: CreateGameInput): Promise<Game> {
    const { gameTypeId, startDate, tournamentId } = input;
    let clubId = input.clubId ?? null;

    if (tournamentId !== undefined) {
      const tournament = await this.tournaments.findOneBy({ id: tournamentId });
      if (!tournament) {
        throw new EntityNotFoundError(Tournament, { id: tournamentId });
      }
      if (clubId !== null && clubId !== tournament.clubId) {
        throw new BadRequestException('The tournament belongs to another club');
      }
      if (tournament.status === TournamentStatus.FINISHED) {
        throw new BadRequestException('The tournament is finished');
      }
      clubId = tournament.clubId;
    }

    await this.access.assertCanHost(user, clubId);
    assertNotInPast(startDate);
    // Throws NotFound for an unknown game type
    await this.gameTypesService.findOne(gameTypeId);

    const { identifiers } = await this.gamesRepository.insert({
      gameTypeId,
      startDate,
      clubId,
      tournamentId: tournamentId ?? null,
    });
    return this.findOne((identifiers[0] as { id: number }).id);
  }

  async update(
    user: JwtUser,
    id: number,
    input: UpdateGameInput,
  ): Promise<Game> {
    const { gameTypeId, startDate } = input;
    const game = await this.findOne(id);
    await this.access.assertCanHost(user, game.clubId);

    if (game.status !== GameStatus.WAITING) {
      throw new BadRequestException(
        'Only a game that has not started can be edited',
      );
    }

    const changes: Partial<Game> = {};
    if (gameTypeId !== undefined && gameTypeId !== game.gameTypeId) {
      changes.gameTypeId = (await this.gameTypesService.findOne(gameTypeId)).id;
    }
    if (startDate !== undefined) {
      assertNotInPast(startDate);
      changes.startDate = startDate;
    }

    // update() instead of save(): saving a game with its loaded players would
    // also write that (possibly stale) relation
    if (Object.keys(changes).length > 0) {
      await this.gamesRepository.update(id, changes);
    }
    return this.findOne(id);
  }

  /** Games with results are kept for history; cancel them instead. */
  async delete(user: JwtUser, id: number): Promise<Game> {
    const game = await this.findOne(id);
    await this.access.assertCanHost(user, game.clubId);
    if (!DELETABLE_STATUSES.includes(game.status)) {
      throw new BadRequestException(
        'A started or finished game cannot be deleted; cancel it instead',
      );
    }
    await this.gamesRepository.delete(id);
    return game;
  }
}

const DELETABLE_STATUSES = [GameStatus.WAITING, GameStatus.CANCELLED];

function assertNotInPast(date: Date): void {
  if (!DateUtils.isTodayOrFuture(date)) {
    throw new BadRequestException('Start date must be today or in the future');
  }
}
