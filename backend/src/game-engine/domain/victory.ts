import { PlayerStatus } from 'src/enums/player-status.enum';
import { Team } from 'src/enums/team.enum';
import { PlayerState } from './types';

/**
 * Classic club rules:
 * - town wins when no mafia and no neutral players are left;
 * - mafia wins when it is at least as many as everyone else;
 * - a neutral (e.g. maniac) wins when the mafia is gone and at most one
 *   other player is left.
 * Returns null while the game goes on.
 */
export function determineWinner(players: readonly PlayerState[]): Team | null {
  const alive = players.filter(p => p.status === PlayerStatus.ALIVE);
  const count = (team: Team) => alive.filter(p => p.team === team).length;

  const town = count(Team.TOWN);
  const mafia = count(Team.MAFIA);
  const neutral = count(Team.NEUTRAL);

  if (mafia === 0 && neutral === 0) {
    return Team.TOWN;
  }
  if (mafia > 0 && mafia >= town + neutral) {
    return Team.MAFIA;
  }
  if (mafia === 0 && neutral > 0 && town + neutral <= 2) {
    return Team.NEUTRAL;
  }
  return null;
}
