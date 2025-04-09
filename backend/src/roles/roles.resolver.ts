import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => Role, { name: 'createRole' })
  create(@Args('data') data: CreateRoleInput) {
    return this.rolesService.create(data);
  }

  @Query(() => [Role], { name: 'roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { name: 'role' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.findOne(id);
  }

  @Mutation(() => Role, { name: 'updateRole' })
  update(@Args('data') data: UpdateRoleInput) {
    return this.rolesService.update(data.id, data);
  }

  @Mutation(() => Role, { name: 'removeRole' })
  remove(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.remove(id);
  }
}
