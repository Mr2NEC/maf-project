import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RoleActionsService } from './role-actions.service';
import { RoleAction } from './entities/role-action.entity';

@Resolver(() => RoleAction)
export class RoleActionsResolver {
  constructor(private readonly roleActionsService: RoleActionsService) {}

  @Query(() => [RoleAction], { name: 'roleActions' })
  findAll() {
    return this.roleActionsService.findAll();
  }

  @Query(() => RoleAction, { name: 'roleAction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roleActionsService.findOne(id);
  }
}
