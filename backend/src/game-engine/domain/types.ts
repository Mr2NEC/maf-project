import { ActionEffect } from 'src/enums/action-effect.enum';
import { PlayerStatus } from 'src/enums/player-status.enum';
import { Team } from 'src/enums/team.enum';

/** A player as the rules see it: no DB or GraphQL concerns. */
export interface PlayerState {
  id: number;
  team: Team;
  status: PlayerStatus;
}

export interface NightAction {
  actorId: number;
  effect: ActionEffect;
  targetId: number;
}

export interface CheckResult {
  actorId: number;
  targetId: number;
  /** null when the checker was blocked */
  team: Team | null;
}

export interface NightOutcome {
  /** Killed and not healed */
  killedIds: number[];
  /** Targeted by a kill but healed */
  savedIds: number[];
  /** Players whose own action was cancelled by a block */
  blockedIds: number[];
  checks: CheckResult[];
}

/** All votes cast against one nominee. */
export interface VoteGroup {
  targetId: number;
  voterIds: number[];
}

export enum TieBreak {
  /** Everyone sharing the most votes leaves */
  ELIMINATE_ALL = 'eliminate_all',
  /** Nobody leaves */
  KEEP_ALL = 'keep_all',
}

export type DayOutcome =
  | { kind: 'eliminated'; playerIds: number[] }
  | { kind: 'no_elimination' }
  /** Several players share the most votes and no tie break was given */
  | { kind: 'tie'; playerIds: number[] };

/** Rule violation caused by the host's input; maps to BAD_REQUEST. */
export class GameRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GameRuleError';
  }
}
