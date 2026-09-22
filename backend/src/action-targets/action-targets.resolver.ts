import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ActionTargetsService } from './action-targets.service';
import { ActionTarget } from './entities/action-target.entity';

// Targets of night actions reveal roles: hosts only
@Roles(UserRole.HOST)
@Resolver(() => ActionTarget)
export class ActionTargetsResolver {
  constructor(private readonly actionTargetsService: ActionTargetsService) {}

  @Query(() => [ActionTarget], { name: 'actionTargets' })
  findAll() {
    return this.actionTargetsService.findAll();
  }

  @Query(() => ActionTarget, { name: 'actionTarget' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionTargetsService.findOne(id);
  }
}
