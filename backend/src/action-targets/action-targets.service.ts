import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionTargetInput } from './dto/create-action-target.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionTarget } from './entities/action-target.entity';

@Injectable()
export class ActionTargetsService {
  constructor(
    @InjectRepository(ActionTarget)
    private actionTargetsRepository: Repository<ActionTarget>,
  ) {}

  async create(createActionTargetInput: CreateActionTargetInput) {
    const { actionId, targetId } = createActionTargetInput;

    if (!actionId || !targetId) {
      throw new NotFoundException('Action or target not found');
    }

    const actionTarget = this.actionTargetsRepository.create({
      actionId,
      targetId,
    });

    return this.actionTargetsRepository.save(actionTarget);
  }

  findAll() {
    return this.actionTargetsRepository.find({
      relations: ['action', 'target'],
    });
  }

  findOne(id: number) {
    return this.actionTargetsRepository.findOne({
      where: { id },
      relations: ['action', 'target'],
    });
  }

  remove(id: number) {
    const actionTarget = this.findOne(id);
    if (!actionTarget) {
      throw new NotFoundException('Action target not found');
    }
    return this.actionTargetsRepository.delete(id);
  }
}
