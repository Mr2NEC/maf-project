import { Public } from 'src/auth/decorators/public.decorator';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ActionTargetsService } from './action-targets.service';
import { ActionTarget } from './entities/action-target.entity';

@Resolver(() => ActionTarget)
export class ActionTargetsResolver {
  constructor(private readonly actionTargetsService: ActionTargetsService) {}

  @Public()
  @Query(() => [ActionTarget], { name: 'actionTargets' })
  findAll() {
    return this.actionTargetsService.findAll();
  }

  @Public()
  @Query(() => ActionTarget, { name: 'actionTarget' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionTargetsService.findOne(id);
  }
}
