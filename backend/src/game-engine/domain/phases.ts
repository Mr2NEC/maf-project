import { GamePhase } from 'src/enums/game-phase.enum';

export interface GameClock {
  phase: GamePhase;
  round: number;
}

/** A game opens with night 1 (the mafia meets), then day 1, night 2, ... */
export const FIRST_PHASE: GameClock = { phase: GamePhase.NIGHT, round: 1 };

export function nextPhase({ phase, round }: GameClock): GameClock {
  return phase === GamePhase.NIGHT
    ? { phase: GamePhase.DAY, round }
    : { phase: GamePhase.NIGHT, round: round + 1 };
}
