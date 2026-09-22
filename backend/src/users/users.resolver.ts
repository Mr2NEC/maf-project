import { PaginationArgs } from 'src/common/dto/pagination.args';
import { ForbiddenException } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { UserRole } from 'src/enums/user-role.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Query(() => [User], { name: 'users' })
  findAll(@Args() { skip, take }: PaginationArgs) {
    return this.usersService.findAll({ skip, take, order: { id: 'ASC' } });
  }

  @Public()
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'me' })
  me(@CurrentUser() currentUser: JwtUser) {
    return this.usersService.findOne(currentUser.userId);
  }

  /** Users can update themselves; admins can update anyone. */
  @Mutation(() => User, { name: 'updateUser' })
  update(
    @CurrentUser() currentUser: JwtUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
  ) {
    if (!canManage(currentUser, id)) {
      throw new ForbiddenException('You can only update your own account');
    }
    return this.usersService.update(id, input);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => User, { name: 'setUserRole' })
  setRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ) {
    return this.usersService.setRole(id, role);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean, { name: 'removeUser' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  /** Email is personal data: only the owner and admins see it. */
  @ResolveField('email', () => String, { nullable: true })
  email(@Parent() user: User, @CurrentUser() currentUser?: JwtUser) {
    return currentUser && canManage(currentUser, user.id) ? user.email : null;
  }

  @ResolveField('profile')
  profile(@Parent() user: User) {
    return user.profile;
  }
}

function canManage(currentUser: JwtUser, userId: number): boolean {
  return currentUser.role === UserRole.ADMIN || currentUser.userId === userId;
}
