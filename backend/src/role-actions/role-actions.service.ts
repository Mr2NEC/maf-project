import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleActionInput } from './dto/create-role-action.input';
import { RoleAction } from './entities/role-action.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class RoleActionsService {
  constructor(
    @InjectRepository(RoleAction)
    private roleActionsRepository: Repository<RoleAction>,
  ) {}

  async create(data: CreateRoleActionInput) {
    const { actionTypeId, roleId } = data;

    if (!roleId) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    if (!actionTypeId) {
      throw new NotFoundException(
        `Action type with id ${actionTypeId} not found`,
      );
    }

    const roleAction = await this.roleActionsRepository.create({
      roleId,
      actionTypeId,
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

  async removeBatch(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.roleActionsRepository.delete({ id: In(ids) });
  }

  async remove(id: number) {
    const roleAction = await this.findOne(id);
    if (!roleAction) {
      throw new NotFoundException(`Role action with id ${id} not found`);
    }
    return this.roleActionsRepository.delete(id);
  }
}
