import { ActionEffect } from 'src/enums/action-effect.enum';
import { PlayerStatus } from 'src/enums/player-status.enum';
import { Team } from 'src/enums/team.enum';
import {
  CheckResult,
  GameRuleError,
  NightAction,
  NightOutcome,
  PlayerState,
} from './types';

const NIGHT_EFFECTS = new Set([
  ActionEffect.KILL,
  ActionEffect.HEAL,
  ActionEffect.CHECK,
  ActionEffect.BLOCK,
  ActionEffect.NOTE,
]);

function findAlive(players: readonly PlayerState[], id: number): PlayerState {
  const player = players.find(p => p.id === id);
  if (!player) {
    throw new GameRuleError(`Player ${id} is not in this game`);
  }
  if (player.status !== PlayerStatus.ALIVE) {
    throw new GameRuleError(`Player ${id} is out of the game`);
  }
  return player;
}

/**
 * Checks a night action against the rules and the actions already recorded
 * this night. Whether the actor's role may use the action type is checked by
 * the caller (it needs role data).
 */
export function validateNightAction(
  action: NightAction,
  players: readonly PlayerState[],
  recorded: readonly NightAction[],
): void {
  if (!NIGHT_EFFECTS.has(action.effect)) {
    throw new GameRuleError(
      `A ${action.effect} action cannot be used at night`,
    );
  }

  const actor = findAlive(players, action.actorId);
  findAlive(players, action.targetId);

  if (recorded.some(r => r.actorId === action.actorId)) {
    throw new GameRuleError(
      `Player ${action.actorId} has already acted this night`,
    );
  }

  if (
    action.effect === ActionEffect.CHECK &&
    action.actorId === action.targetId
  ) {
    throw new GameRuleError('A player cannot check themselves');
  }

  // The mafia shoots once per night as a team; solo killers act on their own
  if (action.effect === ActionEffect.KILL && actor.team === Team.MAFIA) {
    const mafiaAlreadyShot = recorded.some(
      r =>
        r.effect === ActionEffect.KILL &&
        players.find(p => p.id === r.actorId)?.team === Team.MAFIA,
    );
    if (mafiaAlreadyShot) {
      throw new GameRuleError('The mafia has already shot this night');
    }
  }
}

/**
 * Resolves a night in order: blocks cancel their targets' actions, heals
 * protect from kills, kills eliminate, checks reveal a team.
 */
export function resolveNight(
  players: readonly PlayerState[],
  actions: readonly NightAction[],
): NightOutcome {
  const blockedIds = new Set(
    actions.filter(a => a.effect === ActionEffect.BLOCK).map(a => a.targetId),
  );
  const effective = actions.filter(
    a => a.effect === ActionEffect.BLOCK || !blockedIds.has(a.actorId),
  );

  const healedIds = new Set(
    effective.filter(a => a.effect === ActionEffect.HEAL).map(a => a.targetId),
  );
  const killTargets = new Set(
    effective.filter(a => a.effect === ActionEffect.KILL).map(a => a.targetId),
  );

  const killedIds = [...killTargets].filter(id => !healedIds.has(id));
  const savedIds = [...killTargets].filter(id => healedIds.has(id));

  const checks: CheckResult[] = actions
    .filter(a => a.effect === ActionEffect.CHECK)
    .map(a => ({
      actorId: a.actorId,
      targetId: a.targetId,
      team: blockedIds.has(a.actorId)
        ? null
        : (players.find(p => p.id === a.targetId)?.team ?? null),
    }));

  return {
    killedIds: killedIds.sort((a, b) => a - b),
    savedIds: savedIds.sort((a, b) => a - b),
    // Only report blocks that actually cancelled something
    blockedIds: [...blockedIds]
      .filter(id => actions.some(a => a.actorId === id))
      .sort((a, b) => a - b),
    checks,
  };
}
