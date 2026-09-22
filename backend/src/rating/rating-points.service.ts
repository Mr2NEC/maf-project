import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Club } from 'src/clubs/entities/club.entity';
import {
  DEFAULT_RATING_RULES,
  RatingRules,
} from 'src/clubs/entities/rating-rules';
import { GameStatus } from 'src/enums/game-status.enum';

/**
 * Keeps Player.points in line with the club's rating rules: set when a game
 * finishes, and recalculated for the whole club when the rules change, so
 * the rating always reflects the current rules.
 */
@Injectable()
export class RatingPointsService {
  constructor(private readonly dataSource: DataSource) {}

  async rulesFor(
    clubId: number | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<RatingRules> {
    if (clubId === null) {
      return DEFAULT_RATING_RULES;
    }
    // No select: TypeORM does not select embedded columns reliably
    const club = await manager.findOne(Club, { where: { id: clubId } });
    return club?.ratingRules ?? DEFAULT_RATING_RULES;
  }

  /** Recalculates points of every finished game of the club (or of one game). */
  async recalculate(
    rules: RatingRules,
    scope: { clubId: number } | { gameId: number },
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    const [column, id] =
      'clubId' in scope ? ['g.club_id', scope.clubId] : ['g.id', scope.gameId];

    // Same formula as rating/domain/points.ts (gamePoints), in SQL
    await manager.query(
      `UPDATE players p
       JOIN games g ON g.id = p.game_id AND g.status = ?
       LEFT JOIN roles r ON r.id = p.role_id
       SET p.points = ROUND(
         (CASE
            WHEN r.team = g.winnerTeam AND r.team = 'town' THEN ?
            WHEN r.team = g.winnerTeam AND r.team = 'mafia' THEN ?
            WHEN r.team = g.winnerTeam AND r.team = 'neutral' THEN ?
            ELSE ?
          END) + IF(?, p.bonus, 0), 2)
       WHERE ${column} = ?`,
      [
        GameStatus.FINISHED,
        rules.townWinPoints,
        rules.mafiaWinPoints,
        rules.neutralWinPoints,
        rules.lossPoints,
        rules.bonusEnabled ? 1 : 0,
        id,
      ],
    );
  }
}
