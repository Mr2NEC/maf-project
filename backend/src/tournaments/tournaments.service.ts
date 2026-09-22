import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { JwtUser } from 'src/auth/types/jwt-user';
import { ClubAccessService } from 'src/club-members/club-access.service';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { ClubRole } from 'src/enums/club-role.enum';
import { GameStatus } from 'src/enums/game-status.enum';
import { TournamentStatus } from 'src/enums/tournament-status.enum';
import { Game } from 'src/games/entities/game.entity';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { TournamentStanding } from './dto/standing';
import {
  CreateTournamentInput,
  UpdateTournamentInput,
} from './dto/tournament.inputs';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { Tournament } from './entities/tournament.entity';

interface StandingRow {
  userId: number;
  games: string;
  wins: string;
  points: string;
}

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournaments: Repository<Tournament>,
    @InjectRepository(TournamentParticipant)
    private readonly participants: Repository<TournamentParticipant>,
    @InjectRepository(Player) private readonly players: Repository<Player>,
    @InjectRepository(Game) private readonly games: Repository<Game>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly access: ClubAccessService,
  ) {}

  findAll(
    { skip, take }: PaginationArgs,
    filter: { clubId?: number; statuses?: TournamentStatus[] },
  ): Promise<Tournament[]> {
    return this.tournaments.find({
      where: {
        ...(filter.clubId !== undefined && { clubId: filter.clubId }),
        ...(filter.statuses?.length && { status: In(filter.statuses) }),
      },
      relations: { club: true },
      order: { startDate: 'DESC', id: 'DESC' },
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournaments.findOne({
      where: { id },
      relations: { club: true },
    });
    if (!tournament) {
      throw new EntityNotFoundError(Tournament, { id });
    }
    return tournament;
  }

  participantsOf(tournamentId: number): Promise<TournamentParticipant[]> {
    return this.participants.find({
      where: { tournamentId },
      relations: { user: true },
      order: { id: 'ASC' },
    });
  }

  gamesOf(tournamentId: number): Promise<Game[]> {
    return this.games.find({
      where: { tournamentId },
      relations: ['gameType', 'players', 'players.user', 'players.role'],
      order: { startDate: 'ASC', id: 'ASC' },
    });
  }

  /**
   * Sum of points in the tournament's finished games. Participants without a
   * finished game are listed at the bottom with zero.
   */
  async standings(tournamentId: number): Promise<TournamentStanding[]> {
    const rows = await this.players
      .createQueryBuilder('player')
      .innerJoin('player.game', 'game', 'game.status = :finished', {
        finished: GameStatus.FINISHED,
      })
      .leftJoin('player.role', 'role')
      .select('player.userId', 'userId')
      .addSelect('COUNT(*)', 'games')
      .addSelect(
        'SUM(CASE WHEN role.team = game.winnerTeam THEN 1 ELSE 0 END)',
        'wins',
      )
      .addSelect('SUM(player.points)', 'points')
      .where('game.tournamentId = :tournamentId', { tournamentId })
      .groupBy('player.userId')
      .orderBy('points', 'DESC')
      .addOrderBy('wins', 'DESC')
      .addOrderBy('player.userId', 'ASC')
      .getRawMany<StandingRow>();

    const played = new Set(rows.map(r => Number(r.userId)));
    const idle = (await this.participantsOf(tournamentId))
      .map(p => p.userId)
      .filter(id => !played.has(id));

    const userIds = [...rows.map(r => Number(r.userId)), ...idle];
    const users = new Map(
      (await this.users.findBy({ id: In(userIds) })).map(u => [u.id, u]),
    );

    return [
      ...rows.map(r => ({
        userId: Number(r.userId),
        points: Math.round(Number(r.points) * 100) / 100,
        games: Number(r.games),
        wins: Number(r.wins),
      })),
      ...idle.map(userId => ({ userId, points: 0, games: 0, wins: 0 })),
    ].map((row, index) => ({
      place: index + 1,
      user: users.get(row.userId)!,
      points: row.points,
      games: row.games,
      wins: row.wins,
    }));
  }

  async create(
    user: JwtUser,
    input: CreateTournamentInput,
  ): Promise<Tournament> {
    await this.access.assert(user, input.clubId, ClubRole.HOST);
    this.assertDates(input.startDate, input.endDate);
    const { identifiers } = await this.tournaments.insert({
      clubId: input.clubId,
      name: input.name,
      description: input.description ?? null,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
    });
    return this.findOne((identifiers[0] as { id: number }).id);
  }

  async update(
    user: JwtUser,
    id: number,
    input: UpdateTournamentInput,
  ): Promise<Tournament> {
    const tournament = await this.findOne(id);
    await this.access.assert(user, tournament.clubId, ClubRole.HOST);
    this.assertDates(
      input.startDate ?? tournament.startDate,
      input.endDate ?? tournament.endDate ?? undefined,
    );
    if (Object.keys(input).length > 0) {
      await this.tournaments.update(id, input);
    }
    return this.findOne(id);
  }

  /** Only a tournament without games can be deleted. */
  async remove(user: JwtUser, id: number): Promise<boolean> {
    const tournament = await this.findOne(id);
    await this.access.assert(user, tournament.clubId, ClubRole.HOST);
    if (await this.games.existsBy({ tournamentId: id })) {
      throw new BadRequestException(
        'The tournament has games; finish it instead',
      );
    }
    await this.tournaments.delete(id);
    return true;
  }

  async addParticipant(
    user: JwtUser,
    tournamentId: number,
    userId: number,
  ): Promise<TournamentParticipant[]> {
    const tournament = await this.findOne(tournamentId);
    await this.access.assert(user, tournament.clubId, ClubRole.HOST);
    this.assertOpen(tournament);
    if (!(await this.users.existsBy({ id: userId }))) {
      throw new EntityNotFoundError(User, { id: userId });
    }
    if (await this.participants.existsBy({ tournamentId, userId })) {
      throw new ConflictException('Already a participant');
    }
    await this.participants.insert({ tournamentId, userId });
    return this.participantsOf(tournamentId);
  }

  async removeParticipant(
    user: JwtUser,
    tournamentId: number,
    userId: number,
  ): Promise<TournamentParticipant[]> {
    const tournament = await this.findOne(tournamentId);
    await this.access.assert(user, tournament.clubId, ClubRole.HOST);
    this.assertOpen(tournament);
    await this.participants.delete({ tournamentId, userId });
    return this.participantsOf(tournamentId);
  }

  private assertOpen(tournament: Tournament): void {
    if (tournament.status === TournamentStatus.FINISHED) {
      throw new BadRequestException('The tournament is finished');
    }
  }

  private assertDates(start: Date, end?: Date): void {
    if (end && end < start) {
      throw new BadRequestException(
        'The tournament cannot end before it starts',
      );
    }
  }
}
