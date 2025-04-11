import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActionTypesService } from './action-types.service';
import { ActionType } from './entities/action-type.entity';
import { UpdateActionTypeInput } from './dto/update-action-type.input';
import { CreateActionTypeInput } from './dto/create-action-type.input';

@Resolver(() => ActionType)
export class ActionTypesResolver {
  constructor(private readonly actionTypesService: ActionTypesService) {}

  @Mutation(() => ActionType, { name: 'createActionType' })
  create(@Args('data') data: CreateActionTypeInput) {
    return this.actionTypesService.create(data);
  }

  @Query(() => [ActionType], { name: 'actionTypes' })
  findAll() {
    return this.actionTypesService.findAll();
  }

  @Query(() => ActionType, { name: 'actionType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionTypesService.findOne(id);
  }

  @Mutation(() => ActionType, { name: 'updateActionType' })
  update(@Args('data') data: UpdateActionTypeInput) {
    return this.actionTypesService.update(data.id, data);
  }

  @Mutation(() => ActionType, { name: 'removeActionType' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.actionTypesService.remove(id);
  }
}
