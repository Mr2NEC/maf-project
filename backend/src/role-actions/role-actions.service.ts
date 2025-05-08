import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleActionInput } from './dto/create-role-action.input';
import { RoleAction } from './entities/role-action.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BooleanResponse } from 'src/common/dto/boolean-response.output';
import { ValidationUtils } from 'src/common/utils/validation.utils';
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

    const result = await this.roleActionsRepository.save(roleAction);

    return this.findOne(result.id);
  }

  findAll(options: FindManyOptions<RoleAction> = {}) {
    return this.roleActionsRepository.find({
      ...options,
      relations: ['actionType', 'role'],
    });
  }

  async findOne(id: number) {
    const roleAction = await this.roleActionsRepository.findOne({
      where: { id },
      relations: ['actionType', 'role'],
    });
    if (!roleAction) {
      throw new NotFoundException(`Role action with id ${id} not found`);
    }
    return roleAction;
  }

  async removeBatch(ids: number[]): Promise<BooleanResponse> {
    if (ids.length === 0) return { success: false };
    const result = await this.roleActionsRepository.delete({ id: In(ids) });
    return { success: ValidationUtils.isSuccessResult(result) };
  }

  async remove(id: number): Promise<BooleanResponse> {
    const roleAction = await this.findOne(id);
    if (!roleAction) {
      throw new NotFoundException(`Role action with id ${id} not found`);
    }
    const result = await this.roleActionsRepository.delete(id);
    return { success: ValidationUtils.isSuccessResult(result) };
  }
}
