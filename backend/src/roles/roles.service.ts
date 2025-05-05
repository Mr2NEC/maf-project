import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleActionsService } from 'src/role-actions/role-actions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly roleActionsService: RoleActionsService,
  ) {}

  async create(data: CreateRoleInput) {
    const { name, actionIds } = data;
    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });

    if (existingRole) {
      throw new BadRequestException(`Role with name "${name}" already exists`);
    }

    const role = this.rolesRepository.create({ name });

    for (const actionId of actionIds) {
      await this.roleActionsService.create({
        roleId: role.id,
        actionTypeId: actionId,
      });
    }

    return this.rolesRepository.save(role);
  }

  findAll(
    options: FindManyOptions<Role> = {},
    includeRelations: boolean = true,
  ) {
    const findOptions: FindManyOptions<Role> = {
      ...options,
      relations: includeRelations ? ['actions', 'gameTypeRoles'] : [],
    };
    return this.rolesRepository.find(findOptions);
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

  async update(id: number, data: UpdateRoleInput) {
    const { name, actionIds } = data;

    const role = await this.findOne(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (name && role.name !== name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name },
      });
      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException(
          `Role with name "${name}" already exists`,
        );
      }
      role.name = name;
    }

    if (Array.isArray(actionIds) && actionIds.length > 0) {
      const existingActionIds = new Set(
        role.actions.map(action => action.actionTypeId),
      );
      const actionsToAdd = actionIds.filter(id => !existingActionIds.has(id));
      const actionsToRemove = role.actions.filter(
        action => !actionIds.includes(action.actionTypeId),
      );

      if (actionsToRemove.length > 0) {
        await this.roleActionsService.removeBatch(
          actionsToRemove.map(action => action.id),
        );
        role.actions = role.actions.filter(
          action => !actionsToRemove.includes(action),
        );
      }

      if (actionsToAdd.length > 0) {
        const newActions = await Promise.all(
          actionsToAdd.map(actionId =>
            this.roleActionsService.create({
              roleId: role.id,
              actionTypeId: actionId,
            }),
          ),
        );
        role.actions.push(...newActions);
      }
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
}
