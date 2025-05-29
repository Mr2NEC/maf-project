import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt-guard/gql-jwt.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(GqlJwtGuard)
  @Mutation(() => User, { name: 'updateUser' })
  update(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'removeUser' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @ResolveField('profile')
  async profile(@Parent() user: User) {
    return await user.profile;
  }
}
