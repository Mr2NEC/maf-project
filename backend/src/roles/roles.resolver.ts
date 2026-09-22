import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { BooleanResponse } from 'src/common/dto/boolean-response.output';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => Role, { name: 'createRole' })
  create(@Args('data') data: CreateRoleInput) {
    return this.rolesService.create(data);
  }

  @Public()
  @Query(() => [Role], { name: 'roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Public()
  @Query(() => Role, { name: 'role' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Role, { name: 'updateRole' })
  update(@Args('data') data: UpdateRoleInput) {
    return this.rolesService.update(data.id, data);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Role, { name: 'removeRole' })
  async remove(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.remove(id);
  }
}
