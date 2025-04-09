import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleActionsService } from 'src/role-actions/role-actions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly roleActionsService: RoleActionsService,
  ) {}
  async create(createRoleInput: CreateRoleInput) {
    const { name, actionIds } = createRoleInput;
    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });
    if (existingRole) {
      throw new BadRequestException(`Role with name "${name}" already exists`);
    }

    const role = this.rolesRepository.create(createRoleInput);

    if (Array.isArray(actionIds) && actionIds.length > 0) {
      const roleActions = await this.getRoleAction(actionIds);
      role.actions = roleActions;
    }
    return this.rolesRepository.save(role);
  }

  findAll(options: FindManyOptions<Role> = {}) {
    return this.rolesRepository.find({
      relations: ['actions', 'gameTypeRoles'],
      ...options,
    });
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['actions', 'gameTypeRoles'],
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleInput: UpdateRoleInput) {
    const { name, actionIds } = updateRoleInput;

    if (name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name },
      });

      if (existingRole) {
        throw new BadRequestException(
          `Role with name "${name}" already exists`,
        );
      }
    }

    const role = await this.findOne(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (Array.isArray(actionIds) && actionIds.length > 0) {
      const roleActions = await this.getRoleAction(actionIds);
      role.actions = roleActions;
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return this.rolesRepository.delete(id);
  }

  async getRoleAction(roleActionIds: number[]) {
    const roleActions = await this.roleActionsService.findAll({
      where: { id: In(roleActionIds) },
    });
    return roleActions;
  }
}
