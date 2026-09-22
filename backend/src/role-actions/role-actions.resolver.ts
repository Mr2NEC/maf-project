import { Public } from 'src/auth/decorators/public.decorator';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RoleActionsService } from './role-actions.service';
import { RoleAction } from './entities/role-action.entity';

@Resolver(() => RoleAction)
export class RoleActionsResolver {
  constructor(private readonly roleActionsService: RoleActionsService) {}

  @Public()
  @Query(() => [RoleAction], { name: 'roleActions' })
  findAll() {
    return this.roleActionsService.findAll();
  }

  @Public()
  @Query(() => RoleAction, { name: 'roleAction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.roleActionsService.findOne(id);
  }
}
