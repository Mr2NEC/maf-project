import { PaginationArgs } from 'src/common/dto/pagination.args';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActionInput } from './dto/create-action.input';
import { UpdateActionInput } from './dto/update-action.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import { ActionTypesService } from 'src/action-types/action-types.service';
import { PlayersService } from 'src/players/players.service';
import { GamesService } from 'src/games/games.service';
import { ActionTargetsService } from 'src/action-targets/action-targets.service';
import { ValidationUtils } from 'src/common/utils/validation.utils';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private actionsRepository: Repository<Action>,
    private gamesService: GamesService,
    private playersService: PlayersService,
    private actionTypesService: ActionTypesService,
    private actionTargetsService: ActionTargetsService,
  ) {}

  async create(createActionInput: CreateActionInput) {
    const { gameId, actorId, targets, actionTypeId, round, order } =
      createActionInput;

    const game = await this.gamesService.findOne(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const actor = await this.playersService.findOne(actorId);
    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    const actionType = await this.actionTypesService.findOne(actionTypeId);
    if (!actionType) {
      throw new NotFoundException('Action type not found');
    }

    if (targets.length === 0) {
      throw new BadRequestException('Targets are required');
    }

    const action = this.actionsRepository.create({
      game,
      actor,
      actionType,
      round,
      order,
    });

    for (const targetId of targets) {
      const target = await this.playersService.findOne(targetId);

      if (!target) {
        throw new NotFoundException('Target not found');
      }

      await this.actionTargetsService.create({
        actionId: action.id,
        targetId,
      });
    }

    return this.actionsRepository.save(action);
  }

  findAll({ skip, take }: PaginationArgs) {
    return this.actionsRepository.find({
      relations: ['targets', 'targets.target'],
      order: { id: 'ASC' },
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const action = await this.actionsRepository.findOne({
      where: { id },
      relations: ['targets', 'targets.target'],
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    return action;
  }

  async remove(id: number) {
    const action = await this.findOne(id);
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    const result = await this.actionsRepository.delete(id);
    return { success: ValidationUtils.isSuccessResult(result) };
  }
}
