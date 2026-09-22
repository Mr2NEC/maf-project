import { Team } from 'src/enums/team.enum';
import type { RatingRules } from 'src/clubs/entities/rating-rules';

export interface PlayerResult {
  /** The player's team; null if the game ended without a winner */
  team: Team | null;
  winnerTeam: Team | null;
  bonus: number;
}

const WIN_POINTS: Record<Team, keyof RatingRules> = {
  [Team.TOWN]: 'townWinPoints',
  [Team.MAFIA]: 'mafiaWinPoints',
  [Team.NEUTRAL]: 'neutralWinPoints',
};

export function hasWon({ team, winnerTeam }: PlayerResult): boolean {
  return team !== null && team === winnerTeam;
}

/** Rating points for one finished game under the club's rules. */
export function gamePoints(rules: RatingRules, result: PlayerResult): number {
  const base = hasWon(result)
    ? (rules[WIN_POINTS[result.team as Team]] as number)
    : rules.lossPoints;
  const total = base + (rules.bonusEnabled ? result.bonus : 0);
  return Math.round(total * 100) / 100;
}
