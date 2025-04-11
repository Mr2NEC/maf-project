import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { GameTypeRolesService } from './game-type-roles.service';
import { GameTypeRole } from './entities/game-type-role.entity';

@Resolver(() => GameTypeRole)
export class GameTypeRolesResolver {
  constructor(private readonly gameTypeRolesService: GameTypeRolesService) {}

  @Query(() => [GameTypeRole], { name: 'gameTypeRoles' })
  findAll() {
    return this.gameTypeRolesService.findAll();
  }

  @Query(() => GameTypeRole, { name: 'gameTypeRole' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypeRolesService.findOne(id);
  }
}
