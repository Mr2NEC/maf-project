import { ActionEffect } from 'src/enums/action-effect.enum';
import { GamePhase } from 'src/enums/game-phase.enum';
import { PlayerStatus } from 'src/enums/player-status.enum';
import { Team } from 'src/enums/team.enum';
import { resolveVotes } from './day';
import { resolveNight, validateNightAction } from './night';
import { nextPhase } from './phases';
import { distributeRoles, validateManualAssignment } from './roles';
import { GameRuleError, NightAction, PlayerState, TieBreak } from './types';
import { determineWinner } from './victory';

const { KILL, HEAL, CHECK, BLOCK, VOTE } = ActionEffect;

/** Seats 1-10: 1-6 town (5 = sheriff, 6 = doctor), 7-8 mafia, 9 maniac, 10 town. */
function table(
  overrides: Record<number, Partial<PlayerState>> = {},
): PlayerState[] {
  const team = (id: number) =>
    id === 7 || id === 8 ? Team.MAFIA : id === 9 ? Team.NEUTRAL : Team.TOWN;
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    team: team(i + 1),
    status: PlayerStatus.ALIVE,
    ...overrides[i + 1],
  }));
}

const out = (status = PlayerStatus.KILLED) => ({ status });

describe('distributeRoles', () => {
  const composition = [
    { roleId: 100, count: 2 },
    { roleId: 200, count: 1 },
  ];

  it('gives each player one role following the composition', () => {
    const assignment = distributeRoles([1, 2, 3], composition);

    const counts = [...assignment.values()].reduce<Record<number, number>>(
      (acc, roleId) => ({ ...acc, [roleId]: (acc[roleId] ?? 0) + 1 }),
      {},
    );
    expect(counts).toEqual({ 100: 2, 200: 1 });
    expect([...assignment.keys()]).toEqual([1, 2, 3]);
  });

  it('shuffles with the injected random source', () => {
    // Always swap with index 0: [100,100,200] -> [200,100,100] -> [100,200,100]
    const assignment = distributeRoles([1, 2, 3], composition, () => 0);

    expect([...assignment.values()]).toEqual([100, 200, 100]);
  });

  it('rejects a player count that does not match the game type', () => {
    expect(() => distributeRoles([1, 2], composition)).toThrow(GameRuleError);
  });
});

describe('validateManualAssignment', () => {
  const composition = [
    { roleId: 100, count: 2 },
    { roleId: 200, count: 1 },
  ];

  it('accepts cards dealt according to the composition', () => {
    expect(() =>
      validateManualAssignment(
        [1, 2, 3],
        new Map([
          [1, 200],
          [2, 100],
          [3, 100],
        ]),
        composition,
      ),
    ).not.toThrow();
  });

  it('rejects a wrong number of a role', () => {
    expect(() =>
      validateManualAssignment(
        [1, 2, 3],
        new Map([
          [1, 200],
          [2, 200],
          [3, 100],
        ]),
        composition,
      ),
    ).toThrow(/Role 100 must be given to 2 players, got 1/);
  });

  it('rejects players without a role or outside the game', () => {
    expect(() =>
      validateManualAssignment([1, 2, 3], new Map([[1, 100]]), composition),
    ).toThrow(/have no role/);
    expect(() =>
      validateManualAssignment([1], new Map([[9, 100]]), [
        { roleId: 100, count: 1 },
      ]),
    ).toThrow(/not in this game/);
  });
});

describe('validateNightAction', () => {
  const players = table({ 3: out() });
  const act = (
    actorId: number,
    effect: ActionEffect,
    targetId: number,
  ): NightAction => ({
    actorId,
    effect,
    targetId,
  });

  it('accepts a valid action', () => {
    expect(() =>
      validateNightAction(act(7, KILL, 1), players, []),
    ).not.toThrow();
  });

  it('rejects dead actors and dead targets', () => {
    expect(() => validateNightAction(act(3, CHECK, 1), players, [])).toThrow(
      /out of the game/,
    );
    expect(() => validateNightAction(act(7, KILL, 3), players, [])).toThrow(
      /out of the game/,
    );
  });

  it('allows one action per player per night', () => {
    expect(() =>
      validateNightAction(act(5, CHECK, 2), players, [act(5, CHECK, 1)]),
    ).toThrow(/already acted/);
  });

  it('lets the mafia shoot only once per night', () => {
    expect(() =>
      validateNightAction(act(8, KILL, 2), players, [act(7, KILL, 1)]),
    ).toThrow(/mafia has already shot/);
  });

  it('lets a maniac shoot on the same night as the mafia', () => {
    expect(() =>
      validateNightAction(act(9, KILL, 2), players, [act(7, KILL, 1)]),
    ).not.toThrow();
  });

  it('rejects day effects and self-checks', () => {
    expect(() => validateNightAction(act(1, VOTE, 2), players, [])).toThrow(
      /cannot be used at night/,
    );
    expect(() => validateNightAction(act(5, CHECK, 5), players, [])).toThrow(
      /cannot check themselves/,
    );
  });
});

describe('resolveNight', () => {
  const players = table();

  it('kills the mafia target', () => {
    const outcome = resolveNight(players, [
      { actorId: 7, effect: KILL, targetId: 1 },
    ]);

    expect(outcome.killedIds).toEqual([1]);
    expect(outcome.savedIds).toEqual([]);
  });

  it('saves a healed target', () => {
    const outcome = resolveNight(players, [
      { actorId: 7, effect: KILL, targetId: 1 },
      { actorId: 6, effect: HEAL, targetId: 1 },
    ]);

    expect(outcome.killedIds).toEqual([]);
    expect(outcome.savedIds).toEqual([1]);
  });

  it('cancels the action of a blocked player', () => {
    const outcome = resolveNight(players, [
      { actorId: 7, effect: KILL, targetId: 1 },
      { actorId: 2, effect: BLOCK, targetId: 7 },
    ]);

    expect(outcome.killedIds).toEqual([]);
    expect(outcome.blockedIds).toEqual([7]);
  });

  it('blocking the doctor lets the kill through', () => {
    const outcome = resolveNight(players, [
      { actorId: 7, effect: KILL, targetId: 1 },
      { actorId: 6, effect: HEAL, targetId: 1 },
      { actorId: 2, effect: BLOCK, targetId: 6 },
    ]);

    expect(outcome.killedIds).toEqual([1]);
  });

  it('handles the mafia and a maniac killing different players', () => {
    const outcome = resolveNight(players, [
      { actorId: 7, effect: KILL, targetId: 1 },
      { actorId: 9, effect: KILL, targetId: 2 },
    ]);

    expect(outcome.killedIds).toEqual([1, 2]);
  });

  it('reveals the checked team, or nothing if the checker was blocked', () => {
    const checked = resolveNight(players, [
      { actorId: 5, effect: CHECK, targetId: 7 },
    ]);
    const blocked = resolveNight(players, [
      { actorId: 5, effect: CHECK, targetId: 7 },
      { actorId: 2, effect: BLOCK, targetId: 5 },
    ]);

    expect(checked.checks).toEqual([
      { actorId: 5, targetId: 7, team: Team.MAFIA },
    ]);
    expect(blocked.checks).toEqual([{ actorId: 5, targetId: 7, team: null }]);
  });

  it('is a quiet night when nobody acts', () => {
    expect(resolveNight(players, [])).toEqual({
      killedIds: [],
      savedIds: [],
      blockedIds: [],
      checks: [],
    });
  });
});

describe('resolveVotes', () => {
  const players = table({ 3: out() });

  it('eliminates the player with the most votes', () => {
    expect(
      resolveVotes(players, [
        { targetId: 7, voterIds: [1, 2, 4, 5] },
        { targetId: 1, voterIds: [7, 8] },
      ]),
    ).toEqual({ kind: 'eliminated', playerIds: [7] });
  });

  it('reports a tie when no tie break is given', () => {
    expect(
      resolveVotes(players, [
        { targetId: 7, voterIds: [1, 2] },
        { targetId: 1, voterIds: [7, 8] },
      ]),
    ).toEqual({ kind: 'tie', playerIds: [1, 7] });
  });

  it('settles a tie with the tie break', () => {
    const votes = [
      { targetId: 7, voterIds: [1, 2] },
      { targetId: 1, voterIds: [7, 8] },
    ];

    expect(resolveVotes(players, votes, TieBreak.ELIMINATE_ALL)).toEqual({
      kind: 'eliminated',
      playerIds: [1, 7],
    });
    expect(resolveVotes(players, votes, TieBreak.KEEP_ALL)).toEqual({
      kind: 'no_elimination',
    });
  });

  it('eliminates nobody without votes', () => {
    expect(resolveVotes(players, [])).toEqual({ kind: 'no_elimination' });
    expect(resolveVotes(players, [{ targetId: 1, voterIds: [] }])).toEqual({
      kind: 'no_elimination',
    });
  });

  it('rejects double votes, dead voters and dead targets', () => {
    expect(() =>
      resolveVotes(players, [
        { targetId: 7, voterIds: [1] },
        { targetId: 8, voterIds: [1] },
      ]),
    ).toThrow(/voted more than once/);
    expect(() =>
      resolveVotes(players, [{ targetId: 7, voterIds: [3] }]),
    ).toThrow(/cannot vote/);
    expect(() =>
      resolveVotes(players, [{ targetId: 3, voterIds: [1] }]),
    ).toThrow(/cannot be voted against/);
  });
});

describe('determineWinner', () => {
  it('keeps the game going at the start', () => {
    expect(determineWinner(table())).toBeNull();
  });

  it('town wins when the mafia and the maniac are gone', () => {
    expect(determineWinner(table({ 7: out(), 8: out(), 9: out() }))).toBe(
      Team.TOWN,
    );
  });

  it('mafia wins when it equals everyone else', () => {
    // alive: town 1, 2 and mafia 7, 8
    const players = table({
      3: out(),
      4: out(),
      5: out(),
      6: out(),
      9: out(),
      10: out(),
    });

    expect(determineWinner(players)).toBe(Team.MAFIA);
  });

  it('the maniac wins one on one after the mafia is gone', () => {
    const players = table({
      2: out(),
      3: out(),
      4: out(),
      5: out(),
      6: out(),
      7: out(),
      8: out(),
      10: out(),
    });

    expect(determineWinner(players)).toBe(Team.NEUTRAL);
  });

  it('the maniac alone with two townspeople is not a win yet', () => {
    const players = table({
      3: out(),
      4: out(),
      5: out(),
      6: out(),
      7: out(),
      8: out(),
      10: out(),
    });

    expect(determineWinner(players)).toBeNull();
  });
});

describe('nextPhase', () => {
  it('goes night -> day -> next night', () => {
    const day1 = nextPhase({ phase: GamePhase.NIGHT, round: 1 });
    const night2 = nextPhase(day1);

    expect(day1).toEqual({ phase: GamePhase.DAY, round: 1 });
    expect(night2).toEqual({ phase: GamePhase.NIGHT, round: 2 });
  });
});
