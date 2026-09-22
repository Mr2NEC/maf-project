import { PlayerStatus } from 'src/enums/player-status.enum';
import {
  DayOutcome,
  GameRuleError,
  PlayerState,
  TieBreak,
  VoteGroup,
} from './types';

/**
 * Resolves the day vote. The player with the most votes leaves; a tie is
 * settled by `tieBreak`, or reported back so the host can revote or decide.
 */
export function resolveVotes(
  players: readonly PlayerState[],
  votes: readonly VoteGroup[],
  tieBreak?: TieBreak,
): DayOutcome {
  const aliveIds = new Set(
    players.filter(p => p.status === PlayerStatus.ALIVE).map(p => p.id),
  );
  const seenTargets = new Set<number>();
  const seenVoters = new Set<number>();

  for (const { targetId, voterIds } of votes) {
    if (!aliveIds.has(targetId)) {
      throw new GameRuleError(`Player ${targetId} cannot be voted against`);
    }
    if (seenTargets.has(targetId)) {
      throw new GameRuleError(`Player ${targetId} is nominated twice`);
    }
    seenTargets.add(targetId);

    for (const voterId of voterIds) {
      if (!aliveIds.has(voterId)) {
        throw new GameRuleError(`Player ${voterId} cannot vote`);
      }
      if (seenVoters.has(voterId)) {
        throw new GameRuleError(`Player ${voterId} voted more than once`);
      }
      seenVoters.add(voterId);
    }
  }

  const maxVotes = Math.max(0, ...votes.map(v => v.voterIds.length));
  if (maxVotes === 0) {
    return { kind: 'no_elimination' };
  }

  const leaders = votes
    .filter(v => v.voterIds.length === maxVotes)
    .map(v => v.targetId)
    .sort((a, b) => a - b);

  if (leaders.length === 1) {
    return { kind: 'eliminated', playerIds: leaders };
  }

  switch (tieBreak) {
    case TieBreak.ELIMINATE_ALL:
      return { kind: 'eliminated', playerIds: leaders };
    case TieBreak.KEEP_ALL:
      return { kind: 'no_elimination' };
    case undefined:
      return { kind: 'tie', playerIds: leaders };
  }
}
