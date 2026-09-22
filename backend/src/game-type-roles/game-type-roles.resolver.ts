import { Public } from 'src/auth/decorators/public.decorator';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { GameTypeRolesService } from './game-type-roles.service';
import { GameTypeRole } from './entities/game-type-role.entity';

@Resolver(() => GameTypeRole)
export class GameTypeRolesResolver {
  constructor(private readonly gameTypeRolesService: GameTypeRolesService) {}

  @Public()
  @Query(() => [GameTypeRole], { name: 'gameTypeRoles' })
  findAll() {
    return this.gameTypeRolesService.findAll();
  }

  @Public()
  @Query(() => GameTypeRole, { name: 'gameTypeRole' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.gameTypeRolesService.findOne(id);
  }
}
