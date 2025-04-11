import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleActionInput } from './dto/create-role-action.input';
import { UpdateRoleActionInput } from './dto/update-role-action.input';
import { RoleAction } from './entities/role-action.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionTypesService } from 'src/action-types/action-types.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class RoleActionsService {
  constructor(
    @InjectRepository(RoleAction)
    private roleActionsRepository: Repository<RoleAction>,
    private readonly actionTypesService: ActionTypesService,
  ) {}

  async create(data: CreateRoleActionInput) {
    const { actionTypeId, role } = data;

    const actionType = await this.actionTypesService.findOne(actionTypeId);

    if (!actionType) {
      throw new NotFoundException(
        `Action type with id ${actionTypeId} not found`,
      );
    }

    const roleAction = await this.roleActionsRepository.create({
      role,
      actionType,
    });

    return this.roleActionsRepository.save(roleAction);
  }

  findAll(options: FindManyOptions<RoleAction> = {}) {
    return this.roleActionsRepository.find({ ...options });
  }

  async findOne(id: number) {
    const roleAction = await this.roleActionsRepository.findOne({
      where: { id },
    });
    if (!roleAction) {
      throw new NotFoundException(`Role action with id ${id} not found`);
    }
    return roleAction;
  }

  async update(id: number, data: UpdateRoleActionInput) {
    const { actionTypeId, role } = data;

    const roleAction = await this.findOne(id);

    if (!roleAction) {
      throw new NotFoundException(`Role action with id ${id} not found`);
    }

    if (actionTypeId) {
      const actionType = await this.actionTypesService.findOne(actionTypeId);
      roleAction.actionType = actionType;
    }

    if (role) {
      roleAction.role = role;
      roleAction.roleId = role.id;
    }

    return this.roleActionsRepository.save(roleAction);
  }

  async remove(id: number) {
    const roleAction = await this.findOne(id);
    if (!roleAction) {
      throw new NotFoundException(`Role action with id ${id} not found`);
    }
    return this.roleActionsRepository.delete(id);
  }
}
