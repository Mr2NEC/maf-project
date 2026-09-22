import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, EntityNotFoundError, In } from 'typeorm';
import { ActionTarget } from 'src/action-targets/entities/action-target.entity';
import { ActionType } from 'src/action-types/entities/action-type.entity';
import { Action } from 'src/actions/entities/action.entity';
import { ActionEffect } from 'src/enums/action-effect.enum';
import { GamePhase } from 'src/enums/game-phase.enum';
import { GameStatus } from 'src/enums/game-status.enum';
import { PlayerStatus } from 'src/enums/player-status.enum';
import { Team } from 'src/enums/team.enum';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { Game } from 'src/games/entities/game.entity';
import { GamesService } from 'src/games/games.service';
import { Player } from 'src/players/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtUser } from 'src/auth/types/jwt-user';
import { ClubAccessService } from 'src/club-members/club-access.service';
import { RatingPointsService } from 'src/rating/rating-points.service';
import { TournamentParticipant } from 'src/tournaments/entities/tournament-participant.entity';
import { resolveVotes } from './domain/day';
import { resolveNight, validateNightAction } from './domain/night';
import { FIRST_PHASE, nextPhase } from './domain/phases';
import {
  distributeRoles,
  mathRandomInt,
  RandomInt,
  RoleAssignment,
  validateManualAssignment,
} from './domain/roles';
import { GameRuleError, NightAction, PlayerState } from './domain/types';
import { determineWinner } from './domain/victory';
import {
  AddPlayerInput,
  AssignRolesInput,
  AwardBonusInput,
  EndDayInput,
  NightActionInput,
} from './dto/engine.inputs';
import { DayResult, NightResult } from './dto/engine.results';

/** Everything the rules need about one game, loaded inside a transaction. */
interface GameContext {
  manager: EntityManager;
  game: Game;
  gameType: GameType;
  players: Player[];
}

const ENDED = [GameStatus.FINISHED, GameStatus.CANCELLED];

function toState(player: Player): PlayerState {
  return {
    id: player.id,
    team: player.role?.team ?? Team.TOWN,
    status: player.status,
  };
}

function assertStatus(game: Game, status: GameStatus): void {
  if (game.status !== status) {
    throw new GameRuleError(
      `The game is ${game.status}, this needs it to be ${status}`,
    );
  }
}

function assertPhase(game: Game, phase: GamePhase): void {
  assertStatus(game, GameStatus.IN_PROGRESS);
  if (game.phase !== phase) {
    throw new GameRuleError(`It is ${game.phase} now, not ${phase}`);
  }
}

/**
 * Runs a game for the host: seating, roles, nights, days, fouls and results.
 * Every command runs in a transaction that locks the game row, so a double
 * click cannot record an action twice. The rules live in ./domain.
 */
@Injectable()
export class GameEngineService {
  /** Replaced in tests to make role dealing deterministic */
  random: RandomInt = mathRandomInt;

  constructor(
    private readonly dataSource: DataSource,
    private readonly gamesService: GamesService,
    private readonly access: ClubAccessService,
    private readonly ratingPoints: RatingPointsService,
  ) {}

  // --- Before the game -----------------------------------------------------

  async addPlayer(
    user: JwtUser,
    gameId: number,
    input: AddPlayerInput,
  ): Promise<Game> {
    await this.inGame(
      user,
      gameId,
      async ({ manager, game, gameType, players }) => {
        assertStatus(game, GameStatus.WAITING);

        if (players.length >= gameType.playersCount) {
          throw new GameRuleError(
            `The game already has ${gameType.playersCount} players`,
          );
        }
        if (players.some(p => p.userId === input.userId)) {
          throw new GameRuleError('This user already plays in the game');
        }

        const seated = await manager.findOne(User, {
          where: { id: input.userId },
          select: { id: true, username: true },
        });
        if (!seated) {
          throw new EntityNotFoundError(User, { id: input.userId });
        }
        if (
          game.tournamentId !== null &&
          !(await manager.existsBy(TournamentParticipant, {
            tournamentId: game.tournamentId,
            userId: seated.id,
          }))
        ) {
          throw new GameRuleError(
            'Only tournament participants can play this game',
          );
        }

        const taken = new Set(players.map(p => p.seatNumber));
        const seatNumber =
          input.seatNumber ??
          Array.from({ length: gameType.playersCount }, (_, i) => i + 1).find(
            seat => !taken.has(seat),
          );
        if (!seatNumber || seatNumber > gameType.playersCount) {
          throw new GameRuleError(
            `Seat must be between 1 and ${gameType.playersCount}`,
          );
        }
        if (taken.has(seatNumber)) {
          throw new GameRuleError(`Seat ${seatNumber} is taken`);
        }

        await manager.insert(Player, {
          gameId,
          userId: seated.id,
          username: seated.username,
          seatNumber,
        });
      },
    );
    return this.gamesService.findOne(gameId);
  }

  async removePlayer(
    user: JwtUser,
    gameId: number,
    playerId: number,
  ): Promise<Game> {
    await this.inGame(user, gameId, async ({ manager, game, players }) => {
      assertStatus(game, GameStatus.WAITING);
      this.playerOf(players, playerId);
      await manager.delete(Player, { id: playerId });
    });
    return this.gamesService.findOne(gameId);
  }

  async assignRoles(
    user: JwtUser,
    gameId: number,
    input: AssignRolesInput,
  ): Promise<Game> {
    await this.inGame(
      user,
      gameId,
      async ({ manager, game, gameType, players }) => {
        assertStatus(game, GameStatus.WAITING);

        const playerIds = players.map(p => p.id);
        const composition = gameType.gameTypeRoles.map(r => ({
          roleId: r.roleId,
          count: r.count,
        }));
        if (playerIds.length !== gameType.playersCount) {
          throw new GameRuleError(
            `The game needs ${gameType.playersCount} players, ${playerIds.length} registered`,
          );
        }

        let assignment: RoleAssignment;
        if (input.random) {
          assignment = distributeRoles(playerIds, composition, this.random);
        } else {
          if (!input.assignments) {
            throw new GameRuleError('Pass assignments or set random to true');
          }
          assignment = new Map(
            input.assignments.map(a => [a.playerId, a.roleId]),
          );
          validateManualAssignment(playerIds, assignment, composition);
        }

        for (const [playerId, roleId] of assignment) {
          await manager.update(Player, { id: playerId }, { roleId });
        }
      },
    );
    return this.gamesService.findOne(gameId);
  }

  async startGame(user: JwtUser, gameId: number): Promise<Game> {
    await this.inGame(
      user,
      gameId,
      async ({ manager, game, gameType, players }) => {
        assertStatus(game, GameStatus.WAITING);
        if (players.length !== gameType.playersCount) {
          throw new GameRuleError(
            `The game needs ${gameType.playersCount} players, ${players.length} registered`,
          );
        }
        if (players.some(p => !p.roleId)) {
          throw new GameRuleError('Assign roles before starting the game');
        }

        await manager.update(Game, gameId, {
          status: GameStatus.IN_PROGRESS,
          phase: FIRST_PHASE.phase,
          currentRound: FIRST_PHASE.round,
        });
      },
    );
    return this.gamesService.findOne(gameId);
  }

  // --- Night ---------------------------------------------------------------

  async recordNightAction(
    user: JwtUser,
    gameId: number,
    input: NightActionInput,
  ): Promise<Action> {
    const actionId = await this.inGame(user, gameId, async ctx => {
      const { manager, game, players } = ctx;
      assertPhase(game, GamePhase.NIGHT);

      const actionType = await manager.findOne(ActionType, {
        where: { id: input.actionTypeId },
      });
      if (!actionType) {
        throw new EntityNotFoundError(ActionType, { id: input.actionTypeId });
      }
      if (actionType.phase === GamePhase.DAY) {
        throw new GameRuleError(`${actionType.name} is a day action`);
      }

      const actor = this.playerOf(players, input.actorId);
      const allowed = actor.role?.actions?.some(
        ra => ra.actionTypeId === actionType.id,
      );
      if (!allowed) {
        throw new GameRuleError(
          `${actor.role?.name ?? 'This role'} cannot use ${actionType.name}`,
        );
      }

      const recorded = await this.nightActions(ctx);
      validateNightAction(
        {
          actorId: input.actorId,
          effect: actionType.effect,
          targetId: input.targetId,
        },
        players.map(toState),
        recorded,
      );

      const { identifiers } = await manager.insert(Action, {
        gameId,
        actorId: input.actorId,
        actionTypeId: actionType.id,
        round: game.currentRound,
        phase: GamePhase.NIGHT,
        order: recorded.length + 1,
      });
      const id = (identifiers[0] as { id: number }).id;
      await manager.insert(ActionTarget, {
        actionId: id,
        targetId: input.targetId,
      });
      return id;
    });

    return this.dataSource.getRepository(Action).findOneOrFail({
      where: { id: actionId },
      relations: { actor: true, actionType: true, targets: { target: true } },
    });
  }

  /** Lets the host fix a mistake before the night is resolved. */
  async removeNightAction(
    user: JwtUser,
    gameId: number,
    actionId: number,
  ): Promise<boolean> {
    return this.inGame(user, gameId, async ({ manager, game }) => {
      assertPhase(game, GamePhase.NIGHT);
      const result = await manager.delete(Action, {
        id: actionId,
        gameId,
        round: game.currentRound,
        phase: GamePhase.NIGHT,
      });
      if (!result.affected) {
        throw new GameRuleError(
          'Only actions of the current night can be removed',
        );
      }
      return true;
    });
  }

  async endNight(user: JwtUser, gameId: number): Promise<NightResult> {
    const outcome = await this.inGame(user, gameId, async ctx => {
      const { manager, game, players } = ctx;
      assertPhase(game, GamePhase.NIGHT);

      const result = resolveNight(
        players.map(toState),
        await this.nightActions(ctx),
      );

      if (result.killedIds.length) {
        await manager.update(
          Player,
          { id: In(result.killedIds) },
          { status: PlayerStatus.KILLED, eliminatedRound: game.currentRound },
        );
        this.markOut(players, result.killedIds, PlayerStatus.KILLED);
      }
      await this.advanceOrFinish(ctx);
      return result;
    });

    const game = await this.gamesService.findOne(gameId);
    const byId = (id: number) => this.playerOf(game.players, id);
    return {
      game,
      killed: outcome.killedIds.map(byId),
      saved: outcome.savedIds.map(byId),
      blocked: outcome.blockedIds.map(byId),
      checks: outcome.checks.map(c => ({
        actor: byId(c.actorId),
        target: byId(c.targetId),
        team: c.team,
      })),
    };
  }

  // --- Day -----------------------------------------------------------------

  async endDay(
    user: JwtUser,
    gameId: number,
    input: EndDayInput,
  ): Promise<DayResult> {
    const outcome = await this.inGame(user, gameId, async ctx => {
      const { manager, game, players } = ctx;
      assertPhase(game, GamePhase.DAY);

      const result = resolveVotes(
        players.map(toState),
        input.votes,
        input.tieBreak,
      );
      if (result.kind === 'tie') {
        // Nothing is stored: the host revotes or resends with a tie break
        return result;
      }

      await this.storeVotes(ctx, input);

      if (result.kind === 'eliminated') {
        await manager.update(
          Player,
          { id: In(result.playerIds) },
          {
            status: PlayerStatus.VOTED_OUT,
            eliminatedRound: game.currentRound,
          },
        );
        this.markOut(players, result.playerIds, PlayerStatus.VOTED_OUT);
      }
      await this.advanceOrFinish(ctx);
      return result;
    });

    const game = await this.gamesService.findOne(gameId);
    const byId = (id: number) => this.playerOf(game.players, id);
    return {
      game,
      eliminated:
        outcome.kind === 'eliminated' ? outcome.playerIds.map(byId) : [],
      tie: outcome.kind === 'tie',
      tiedPlayers: outcome.kind === 'tie' ? outcome.playerIds.map(byId) : [],
    };
  }

  // --- Any time ------------------------------------------------------------

  /** Reaching the game type's foul limit disqualifies the player. */
  async addFoul(
    user: JwtUser,
    gameId: number,
    playerId: number,
  ): Promise<Game> {
    await this.inGame(user, gameId, async ctx => {
      const { manager, game, gameType, players } = ctx;
      assertStatus(game, GameStatus.IN_PROGRESS);

      const player = this.playerOf(players, playerId);
      if (player.status !== PlayerStatus.ALIVE) {
        throw new GameRuleError(`Player ${playerId} is out of the game`);
      }

      const fouls = player.fouls + 1;
      const disqualified = fouls >= gameType.maxFouls;
      await manager.update(
        Player,
        { id: playerId },
        {
          fouls,
          ...(disqualified && {
            status: PlayerStatus.DISQUALIFIED,
            eliminatedRound: game.currentRound,
          }),
        },
      );

      if (disqualified) {
        this.markOut(players, [playerId], PlayerStatus.DISQUALIFIED);
        const winner = determineWinner(players.map(toState));
        if (winner) {
          await this.finish(ctx, winner);
        }
      }
    });
    return this.gamesService.findOne(gameId);
  }

  async cancelGame(user: JwtUser, gameId: number): Promise<Game> {
    await this.inGame(user, gameId, async ({ manager, game }) => {
      if (ENDED.includes(game.status)) {
        throw new GameRuleError(`The game is already ${game.status}`);
      }
      await manager.update(Game, gameId, {
        status: GameStatus.CANCELLED,
        phase: null,
        finishedAt: new Date(),
      });
    });
    return this.gamesService.findOne(gameId);
  }

  /** Extra points from the host after the game, e.g. for the best move. */
  async awardBonus(
    user: JwtUser,
    gameId: number,
    input: AwardBonusInput,
  ): Promise<Game> {
    await this.inGame(user, gameId, async ({ manager, game, players }) => {
      assertStatus(game, GameStatus.FINISHED);
      const player = this.playerOf(players, input.playerId);
      await manager.update(
        Player,
        { id: player.id },
        { bonus: Math.round((player.bonus + input.points) * 100) / 100 },
      );
      await this.recalculatePoints(manager, game);
    });
    return this.gamesService.findOne(gameId);
  }

  // --- Helpers -------------------------------------------------------------

  private inGame<T>(
    user: JwtUser,
    gameId: number,
    work: (ctx: GameContext) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(async manager => {
      // Lock the game row alone: MySQL cannot lock the nullable side of a join
      const game = await manager.findOne(Game, {
        where: { id: gameId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!game) {
        throw new EntityNotFoundError(Game, { id: gameId });
      }
      // Club hosts run club games; platform hosts run games without a club
      await this.access.assertCanHost(user, game.clubId, manager);

      const gameType = await manager.findOneOrFail(GameType, {
        where: { id: game.gameTypeId },
        relations: { gameTypeRoles: true },
      });
      const players = await manager.find(Player, {
        where: { gameId },
        relations: { role: { actions: true } },
        order: { seatNumber: 'ASC' },
      });

      return work({ manager, game, gameType, players });
    });
  }

  private playerOf(players: readonly Player[], playerId: number): Player {
    const player = players.find(p => p.id === playerId);
    if (!player) {
      throw new GameRuleError(`Player ${playerId} is not in this game`);
    }
    return player;
  }

  private async nightActions({
    manager,
    game,
  }: GameContext): Promise<NightAction[]> {
    const actions = await manager.find(Action, {
      where: {
        gameId: game.id,
        round: game.currentRound,
        phase: GamePhase.NIGHT,
      },
      relations: { actionType: true, targets: true },
      order: { order: 'ASC' },
    });
    return actions.map(a => ({
      actorId: a.actorId,
      effect: a.actionType.effect,
      targetId: a.targets[0]?.targetId,
    }));
  }

  /** Stores each vote as a VOTE action so the game log is complete. */
  private async storeVotes(
    { manager, game }: GameContext,
    { votes }: EndDayInput,
  ): Promise<void> {
    if (!votes.some(v => v.voterIds.length)) {
      return;
    }
    const voteType = await manager.findOne(ActionType, {
      where: { effect: ActionEffect.VOTE },
    });
    if (!voteType) {
      throw new Error('No action type with the VOTE effect; run migrations');
    }

    let order = 0;
    for (const { targetId, voterIds } of votes) {
      for (const actorId of voterIds) {
        const { identifiers } = await manager.insert(Action, {
          gameId: game.id,
          actorId,
          actionTypeId: voteType.id,
          round: game.currentRound,
          phase: GamePhase.DAY,
          order: ++order,
        });
        await manager.insert(ActionTarget, {
          actionId: (identifiers[0] as { id: number }).id,
          targetId,
        });
      }
    }
  }

  private markOut(players: Player[], ids: number[], status: PlayerStatus) {
    for (const player of players) {
      if (ids.includes(player.id)) {
        player.status = status;
      }
    }
  }

  private async advanceOrFinish(ctx: GameContext): Promise<void> {
    const winner = determineWinner(ctx.players.map(toState));
    if (winner) {
      await this.finish(ctx, winner);
      return;
    }

    const next = nextPhase({
      phase: ctx.game.phase as GamePhase,
      round: ctx.game.currentRound,
    });
    await ctx.manager.update(Game, ctx.game.id, {
      phase: next.phase,
      currentRound: next.round,
    });
  }

  /** Points follow the club's rating rules; bonuses are added later by the host. */
  private async finish(
    { manager, game }: GameContext,
    winner: Team,
  ): Promise<void> {
    await manager.update(Game, game.id, {
      status: GameStatus.FINISHED,
      winnerTeam: winner,
      phase: null,
      finishedAt: new Date(),
    });
    await this.recalculatePoints(manager, game);
  }

  private async recalculatePoints(
    manager: EntityManager,
    game: Game,
  ): Promise<void> {
    const rules = await this.ratingPoints.rulesFor(game.clubId, manager);
    await this.ratingPoints.recalculate(rules, { gameId: game.id }, manager);
  }
}
