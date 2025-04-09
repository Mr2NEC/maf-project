import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleActionsService } from './role-actions.service';
import { RoleAction } from './entities/role-action.entity';
import { UpdateRoleActionInput } from './dto/update-role-action.input';

@Resolver(() => RoleAction)
export class RoleActionsResolver {
  constructor(private readonly roleActionsService: RoleActionsService) {}

  @Mutation(() => RoleAction)
  createRoleAction(
    @Args('roleId', { type: () => Int }) roleId: number,
    @Args('actionTypeId', { type: () => Int }) actionTypeId: number,
  ) {
    return this.roleActionsService.create({ roleId, actionTypeId });
  }

  @Query(() => [RoleAction], { name: 'roleActions' })
  findAll() {
    return this.roleActionsService.findAll();
  }

  @Query(() => RoleAction, { name: 'roleAction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roleActionsService.findOne(id);
  }

  @Mutation(() => RoleAction)
  updateRoleAction(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateRoleActionInput,
  ) {
    return this.roleActionsService.update(id, data);
  }

  @Mutation(() => RoleAction)
  removeRoleAction(@Args('id', { type: () => Int }) id: number) {
    return this.roleActionsService.remove(id);
  }
}
