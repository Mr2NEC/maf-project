import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActionTargetsService } from './action-targets.service';
import { ActionTarget } from './entities/action-target.entity';
import { CreateActionTargetInput } from './dto/create-action-target.input';
import { UpdateActionTargetInput } from './dto/update-action-target.input';

@Resolver(() => ActionTarget)
export class ActionTargetsResolver {
  constructor(private readonly actionTargetsService: ActionTargetsService) {}

  @Mutation(() => ActionTarget)
  createActionTarget(@Args('createActionTargetInput') createActionTargetInput: CreateActionTargetInput) {
    return this.actionTargetsService.create(createActionTargetInput);
  }

  @Query(() => [ActionTarget], { name: 'actionTargets' })
  findAll() {
    return this.actionTargetsService.findAll();
  }

  @Query(() => ActionTarget, { name: 'actionTarget' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionTargetsService.findOne(id);
  }

  @Mutation(() => ActionTarget)
  updateActionTarget(@Args('updateActionTargetInput') updateActionTargetInput: UpdateActionTargetInput) {
    return this.actionTargetsService.update(updateActionTargetInput.id, updateActionTargetInput);
  }

  @Mutation(() => ActionTarget)
  removeActionTarget(@Args('id', { type: () => Int }) id: number) {
    return this.actionTargetsService.remove(id);
  }
}
