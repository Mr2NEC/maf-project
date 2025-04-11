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

    const actionType = this.actionTypesRepository.create({ name });
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

    const actionType = await this.findOne(id);
    if (!actionType) {
      throw new NotFoundException(`Action type with id ${id} not found`);
    }

    if (name) {
      const existingActionType = await this.actionTypesRepository.findOne({
        where: { name },
      });

      if (existingActionType) {
        throw new BadRequestException(
          `Action type with name "${name}" already exists`,
        );
      }

      actionType.name = name;
    }

    return this.actionTypesRepository.save(actionType);
  }

  async remove(id: number) {
    const actionType = await this.findOne(id);
    if (!actionType) {
      throw new NotFoundException(`Action type with id ${id} not found`);
    }
    return this.actionTypesRepository.delete(actionType);
  }
}
