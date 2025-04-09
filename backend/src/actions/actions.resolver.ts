import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';
import { CreateActionInput } from './dto/create-action.input';
import { UpdateActionInput } from './dto/update-action.input';

@Resolver(() => Action)
export class ActionsResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Mutation(() => Action)
  createAction(@Args('createActionInput') createActionInput: CreateActionInput) {
    return this.actionsService.create(createActionInput);
  }

  @Query(() => [Action], { name: 'actions' })
  findAll() {
    return this.actionsService.findAll();
  }

  @Query(() => Action, { name: 'action' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionsService.findOne(id);
  }

  @Mutation(() => Action)
  updateAction(@Args('updateActionInput') updateActionInput: UpdateActionInput) {
    return this.actionsService.update(updateActionInput.id, updateActionInput);
  }

  @Mutation(() => Action)
  removeAction(@Args('id', { type: () => Int }) id: number) {
    return this.actionsService.remove(id);
  }
}
