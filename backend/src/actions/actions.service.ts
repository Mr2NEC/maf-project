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

    const action = await this.actionsRepository.create({
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
      const actionTarget = await this.actionTargetsService.create({
        action,
        targetId,
      });

      action.targets.push(actionTarget);
    }

    return this.actionsRepository.save(action);
  }

  findAll() {
    return this.actionsRepository.find({
      relations: ['targets', 'targets.target'],
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

  async update(id: number, updateActionInput: UpdateActionInput) {
    const { gameId, actorId, targets, actionTypeId, round, order } =
      updateActionInput;

    const action = await this.findOne(id);
    if (!action) {
      throw new NotFoundException('Action not found');
    }

    if (gameId) {
      const game = await this.gamesService.findOne(gameId);
      if (!game) {
        throw new NotFoundException('Game not found');
      }
      action.game = game;
    }

    if (actorId) {
      const actor = await this.playersService.findOne(actorId);
      if (!actor) {
        throw new NotFoundException('Actor not found');
      }
      action.actor = actor;
    }

    if (actionTypeId) {
      const actionType = await this.actionTypesService.findOne(actionTypeId);
      if (!actionType) {
        throw new NotFoundException('Action type not found');
      }
      action.actionType = actionType;
    }

    if (round) {
      action.round = round;
    }

    if (order) {
      action.order = order;
    }

    return this.actionsRepository.save(action);
  }

  async remove(id: number) {
    const action = await this.findOne(id);
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    return this.actionsRepository.delete(id);
  }
}
