import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameTypeRolesService } from './game-type-roles.service';
import { GameTypeRole } from './entities/game-type-role.entity';
import { CreateGameTypeRoleInput } from './dto/create-game-type-role.input';
import { UpdateGameTypeRoleInput } from './dto/update-game-type-role.input';

@Resolver(() => GameTypeRole)
export class GameTypeRolesResolver {
  constructor(private readonly gameTypeRolesService: GameTypeRolesService) {}

  @Mutation(() => GameTypeRole)
  createGameTypeRole(@Args('createGameTypeRoleInput') createGameTypeRoleInput: CreateGameTypeRoleInput) {
    return this.gameTypeRolesService.create(createGameTypeRoleInput);
  }

  @Query(() => [GameTypeRole], { name: 'gameTypeRoles' })
  findAll() {
    return this.gameTypeRolesService.findAll();
  }

  @Query(() => GameTypeRole, { name: 'gameTypeRole' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypeRolesService.findOne(id);
  }

  @Mutation(() => GameTypeRole)
  updateGameTypeRole(@Args('updateGameTypeRoleInput') updateGameTypeRoleInput: UpdateGameTypeRoleInput) {
    return this.gameTypeRolesService.update(updateGameTypeRoleInput.id, updateGameTypeRoleInput);
  }

  @Mutation(() => GameTypeRole)
  removeGameTypeRole(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypeRolesService.remove(id);
  }
}
