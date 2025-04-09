import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActionTypesService } from './action-types.service';
import { ActionType } from './entities/action-type.entity';

@Resolver(() => ActionType)
export class ActionTypesResolver {
  constructor(private readonly actionTypesService: ActionTypesService) {}

  @Mutation(() => ActionType)
  createActionType(@Args('name') name: string) {
    return this.actionTypesService.create({ name });
  }

  @Query(() => [ActionType], { name: 'actionTypes' })
  findAll() {
    return this.actionTypesService.findAll();
  }

  @Query(() => ActionType, { name: 'actionType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionTypesService.findOne(id);
  }

  @Mutation(() => ActionType)
  updateActionType(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ) {
    return this.actionTypesService.update(id, { id, name });
  }

  @Mutation(() => ActionType)
  removeActionType(@Args('id', { type: () => Int }) id: number) {
    return this.actionTypesService.remove(id);
  }
}
