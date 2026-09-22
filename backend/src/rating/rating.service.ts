import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GameStatus } from 'src/enums/game-status.enum';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { RatingArgs } from './dto/rating.args';
import { RatingEntry } from './dto/rating-entry';
import { RatingPointsService } from './rating-points.service';

interface RatingRow {
  userId: number;
  games: string;
  wins: string;
  points: string;
}

/** Club rating: points from finished games, then wins, then fewer games. */
@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Player)
    private readonly playersRepository: Repository<Player>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly ratingPoints: RatingPointsService,
  ) {}

  async rating({
    from,
    to,
    skip,
    take,
    clubId,
  }: RatingArgs): Promise<RatingEntry[]> {
    const query = this.playersRepository
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
      .groupBy('player.userId')
      .orderBy('points', 'DESC')
      .addOrderBy('wins', 'DESC')
      .addOrderBy('games', 'ASC')
      .addOrderBy('player.userId', 'ASC')
      .offset(skip)
      .limit(take);

    if (from) {
      query.andWhere('game.finishedAt >= :from', { from });
    }
    if (to) {
      query.andWhere('game.finishedAt < :to', { to });
    }
    if (clubId !== undefined) {
      // A club's rating: only its games, and only players with enough of them
      query.andWhere('game.clubId = :clubId', { clubId });
      const rules = await this.ratingPoints.rulesFor(clubId);
      if (rules.minGames > 0) {
        query.having('COUNT(*) >= :minGames', { minGames: rules.minGames });
      }
    }

    const rows = await query.getRawMany<RatingRow>();
    const users = await this.usersRepository.findBy({
      id: In(rows.map(r => r.userId)),
    });
    const userById = new Map(users.map(u => [u.id, u]));

    return rows.map((row, index) => {
      const games = Number(row.games);
      const wins = Number(row.wins);
      return {
        place: skip + index + 1,
        user: userById.get(row.userId)!,
        points: Math.round(Number(row.points) * 100) / 100,
        games,
        wins,
        winRate: games ? Math.round((wins / games) * 1000) / 1000 : 0,
      };
    });
  }
}
