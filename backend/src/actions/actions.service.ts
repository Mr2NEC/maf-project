import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { Action } from './entities/action.entity';

/** Read access to the game log. Actions are written by the game engine. */
@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionsRepository: Repository<Action>,
  ) {}

  findAll(gameId: number | undefined, { skip, take }: PaginationArgs) {
    return this.actionsRepository.find({
      where: gameId === undefined ? {} : { gameId },
      relations: { actor: true, actionType: true, targets: { target: true } },
      order: { round: 'ASC', phase: 'ASC', order: 'ASC', id: 'ASC' },
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const action = await this.actionsRepository.findOne({
      where: { id },
      relations: { actor: true, actionType: true, targets: { target: true } },
    });
    if (!action) {
      throw new EntityNotFoundError(Action, { id });
    }
    return action;
  }
}
