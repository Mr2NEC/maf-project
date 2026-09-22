import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { UserRole } from 'src/enums/user-role.enum';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';

/**
 * The game log reveals night actions and therefore roles, so it is only for
 * hosts. Actions are recorded through the game engine mutations.
 */
@Roles(UserRole.HOST)
@Resolver(() => Action)
export class ActionsResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Query(() => [Action], { name: 'actions' })
  findAll(
    @Args() pagination: PaginationArgs,
    @Args('gameId', { type: () => Int, nullable: true }) gameId?: number,
  ) {
    return this.actionsService.findAll(gameId, pagination);
  }

  @Query(() => Action, { name: 'action' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionsService.findOne(id);
  }
}
