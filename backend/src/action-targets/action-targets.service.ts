import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionTargetInput } from './dto/create-action-target.input';
import { UpdateActionTargetInput } from './dto/update-action-target.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionTarget } from './entities/action-target.entity';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class ActionTargetsService {
  constructor(
    @InjectRepository(ActionTarget)
    private actionTargetsRepository: Repository<ActionTarget>,
    private playersService: PlayersService,
  ) {}

  async create(createActionTargetInput: CreateActionTargetInput) {
    const { action, targetId } = createActionTargetInput;

    const target = await this.playersService.findOne(targetId);

    if (!action || !target) {
      throw new NotFoundException('Action or target not found');
    }
    const actionTarget = this.actionTargetsRepository.create({
      action,
      target,
      actionId: action.id,
      targetId: target.id,
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

  async update(id: number, updateActionTargetInput: UpdateActionTargetInput) {
    const { action, targetId } = updateActionTargetInput;

    const actionTarget = await this.findOne(id);
    if (!actionTarget) {
      throw new NotFoundException('Action target not found');
    }
    if (action) {
      actionTarget.action = action;
    }
    if (targetId) {
      const target = await this.playersService.findOne(targetId);
      if (!target) {
        throw new NotFoundException('Target not found');
      }
      actionTarget.target = target;
    }

    return this.actionTargetsRepository.save(actionTarget);
  }

  remove(id: number) {
    const actionTarget = this.findOne(id);
    if (!actionTarget) {
      throw new NotFoundException('Action target not found');
    }
    return this.actionTargetsRepository.delete(id);
  }
}
