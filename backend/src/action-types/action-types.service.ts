import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActionTypeInput } from './dto/create-action-type.input';
import { UpdateActionTypeInput } from './dto/update-action-type.input';
import { ActionType } from './entities/action-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActionTypesService {
  constructor(
    @InjectRepository(ActionType)
    private actionTypesRepository: Repository<ActionType>,
  ) {}

  async create(createActionTypeInput: CreateActionTypeInput) {
    const { name } = createActionTypeInput;
    const existingActionType = await this.actionTypesRepository.findOne({
      where: { name },
    });

    if (existingActionType) {
      throw new BadRequestException(
        `Action type with name "${name}" already exists`,
      );
    }

    const actionType = this.actionTypesRepository.create(createActionTypeInput);
    return this.actionTypesRepository.save(actionType);
  }

  findAll() {
    return this.actionTypesRepository.find();
  }

  async findOne(id: number) {
    const actionType = await this.actionTypesRepository.findOne({
      where: { id },
    });
    if (!actionType) {
      throw new NotFoundException(`Action type with id ${id} not found`);
    }
    return actionType;
  }

  async update(id: number, updateActionTypeInput: UpdateActionTypeInput) {
    const { name } = updateActionTypeInput;
    const existingActionType = await this.actionTypesRepository.findOne({
      where: { name },
    });

    if (existingActionType) {
      throw new BadRequestException(
        `Action type with name "${name}" already exists`,
      );
    }

    const actionType = await this.findOne(id);
    return this.actionTypesRepository.save({
      ...actionType,
      name,
    });
  }

  async remove(id: number) {
    const actionType = await this.findOne(id);
    if (!actionType) {
      throw new NotFoundException(`Action type with id ${id} not found`);
    }
    return this.actionTypesRepository.delete(actionType);
  }
}
