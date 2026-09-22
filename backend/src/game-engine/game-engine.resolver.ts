import { UseFilters } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { Action } from 'src/actions/entities/action.entity';
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

/**
 * Commands for the host running a game at the table. Access is checked per
 * game: club hosts for club games (see ClubAccessService.assertCanHost).
 */
@UseFilters(GameRuleFilter)
@Resolver()
export class GameEngineResolver {
  constructor(private readonly engine: GameEngineService) {}

  @Mutation(() => Game)
  addPlayerToGame(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: AddPlayerInput,
  ) {
    return this.engine.addPlayer(user, gameId, input);
  }

  @Mutation(() => Game)
  removePlayerFromGame(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('playerId', { type: () => Int }) playerId: number,
  ) {
    return this.engine.removePlayer(user, gameId, playerId);
  }

  @Mutation(() => Game)
  assignRoles(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: AssignRolesInput,
  ) {
    return this.engine.assignRoles(user, gameId, input);
  }

  @Mutation(() => Game)
  startGame(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
  ) {
    return this.engine.startGame(user, gameId);
  }

  @Mutation(() => Action)
  recordNightAction(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: NightActionInput,
  ) {
    return this.engine.recordNightAction(user, gameId, input);
  }

  @Mutation(() => Boolean)
  removeNightAction(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('actionId', { type: () => Int }) actionId: number,
  ) {
    return this.engine.removeNightAction(user, gameId, actionId);
  }

  @Mutation(() => NightResult)
  endNight(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
  ) {
    return this.engine.endNight(user, gameId);
  }

  @Mutation(() => DayResult)
  endDay(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: EndDayInput,
  ) {
    return this.engine.endDay(user, gameId, input);
  }

  @Mutation(() => Game)
  addFoul(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('playerId', { type: () => Int }) playerId: number,
  ) {
    return this.engine.addFoul(user, gameId, playerId);
  }

  @Mutation(() => Game)
  cancelGame(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
  ) {
    return this.engine.cancelGame(user, gameId);
  }

  @Mutation(() => Game)
  awardBonus(
    @CurrentUser() user: JwtUser,
    @Args('gameId', { type: () => Int }) gameId: number,
    @Args('input') input: AwardBonusInput,
  ) {
    return this.engine.awardBonus(user, gameId, input);
  }
}
