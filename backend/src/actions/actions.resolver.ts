import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActionsService } from './actions.service';
import { Action } from './entities/action.entity';
import { CreateActionInput } from './dto/create-action.input';
import { UpdateActionInput } from './dto/update-action.input';

@Resolver(() => Action)
export class ActionsResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Roles(UserRole.HOST)
  @Mutation(() => Action, { name: 'createAction' })
  create(@Args('data') data: CreateActionInput) {
    return this.actionsService.create(data);
  }

  @Public()
  @Query(() => [Action], { name: 'actions' })
  findAll(@Args() pagination: PaginationArgs) {
    return this.actionsService.findAll(pagination);
  }

  @Public()
  @Query(() => Action, { name: 'action' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.actionsService.findOne(id);
  }

  @Roles(UserRole.HOST)
  @Mutation(() => Action, { name: 'removeAction' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.actionsService.remove(id);
  }
}
