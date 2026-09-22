import { UseFilters } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Action } from 'src/actions/entities/action.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { Game } from 'src/games/entities/game.entity';
import {
  AddPlayerInput,
  AssignRolesInput,
  AwardBonusInput,
  EndDayInput,
  NightActionInput,
} from './dto/engine.inputs';
import { DayResult, NightResult } from './dto/engine.results';
import { GameEngineService } from './game-engine.service';
import { GameRuleFilter } from './game-rule.filter';

/** Commands for the host running a game at the table. */
@Roles(UserRole.HOST)
@UseFilters(GameRuleFilter)
@Resolver()
export class GameEngineResolver {
  constructor(private readonly engine: GameEngineService) {}

  @Mutation(() => Game)
  addPlayerToGame(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: AddPlayerInput,
  ) {
    return this.engine.addPlayer(gameId, input);
  }

  @Mutation(() => Game)
  removePlayerFromGame(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('playerId', { type: () => Int }) playerId: number,
  ) {
    return this.engine.removePlayer(gameId, playerId);
  }

  @Mutation(() => Game)
  assignRoles(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: AssignRolesInput,
  ) {
    return this.engine.assignRoles(gameId, input);
  }

  @Mutation(() => Game)
  startGame(@Args('gameId', { type: () => Int }) gameId: number) {
    return this.engine.startGame(gameId);
  }

  @Mutation(() => Action)
  recordNightAction(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: NightActionInput,
  ) {
    return this.engine.recordNightAction(gameId, input);
  }

  @Mutation(() => Boolean)
  removeNightAction(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('actionId', { type: () => Int }) actionId: number,
  ) {
    return this.engine.removeNightAction(gameId, actionId);
  }

  @Mutation(() => NightResult)
  endNight(@Args('gameId', { type: () => Int }) gameId: number) {
    return this.engine.endNight(gameId);
  }

  @Mutation(() => DayResult)
  endDay(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: EndDayInput,
  ) {
    return this.engine.endDay(gameId, input);
  }

  @Mutation(() => Game)
  addFoul(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('playerId', { type: () => Int }) playerId: number,
  ) {
    return this.engine.addFoul(gameId, playerId);
  }

  @Mutation(() => Game)
  cancelGame(@Args('gameId', { type: () => Int }) gameId: number) {
    return this.engine.cancelGame(gameId);
  }

  @Mutation(() => Game)
  awardBonus(
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: AwardBonusInput,
  ) {
    return this.engine.awardBonus(gameId, input);
  }
}
