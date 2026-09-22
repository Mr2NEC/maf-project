import { GameRuleError } from './types';

export interface RoleSlot {
  roleId: number;
  count: number;
}

export type RoleAssignment = Map<number, number>; // playerId -> roleId

/** Picks a random index in [0, max). Injected so tests are deterministic. */
export type RandomInt = (max: number) => number;

export const mathRandomInt: RandomInt = max => Math.floor(Math.random() * max);

function expand(composition: readonly RoleSlot[]): number[] {
  return composition.flatMap(({ roleId, count }) =>
    Array.from({ length: count }, () => roleId),
  );
}

/** Gives every player one role from the game type's composition, shuffled. */
export function distributeRoles(
  playerIds: readonly number[],
  composition: readonly RoleSlot[],
  randomInt: RandomInt = mathRandomInt,
): RoleAssignment {
  const roles = expand(composition);
  if (roles.length !== playerIds.length) {
    throw new GameRuleError(
      `The game type needs ${roles.length} players, but ${playerIds.length} are registered`,
    );
  }

  // Fisher–Yates
  for (let i = roles.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return new Map(playerIds.map((playerId, index) => [playerId, roles[index]]));
}

/** Checks a manual assignment (e.g. from cards dealt at the table). */
export function validateManualAssignment(
  playerIds: readonly number[],
  assignment: RoleAssignment,
  composition: readonly RoleSlot[],
): void {
  const unknown = [...assignment.keys()].filter(id => !playerIds.includes(id));
  if (unknown.length) {
    throw new GameRuleError(
      `Players ${unknown.join(', ')} are not in this game`,
    );
  }

  const missing = playerIds.filter(id => !assignment.has(id));
  if (missing.length) {
    throw new GameRuleError(`Players ${missing.join(', ')} have no role`);
  }

  const expected = new Map(composition.map(s => [s.roleId, s.count]));
  const actual = new Map<number, number>();
  for (const roleId of assignment.values()) {
    actual.set(roleId, (actual.get(roleId) ?? 0) + 1);
  }

  const roleIds = new Set([...expected.keys(), ...actual.keys()]);
  for (const roleId of roleIds) {
    const want = expected.get(roleId) ?? 0;
    const got = actual.get(roleId) ?? 0;
    if (want !== got) {
      throw new GameRuleError(
        `Role ${roleId} must be given to ${want} players, got ${got}`,
      );
    }
  }
}
