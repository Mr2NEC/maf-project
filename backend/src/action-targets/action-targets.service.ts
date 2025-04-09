import { Injectable } from '@nestjs/common';
import { CreateActionTargetInput } from './dto/create-action-target.input';
import { UpdateActionTargetInput } from './dto/update-action-target.input';

@Injectable()
export class ActionTargetsService {
  create(createActionTargetInput: CreateActionTargetInput) {
    return 'This action adds a new actionTarget';
  }

  findAll() {
    return `This action returns all actionTargets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} actionTarget`;
  }

  update(id: number, updateActionTargetInput: UpdateActionTargetInput) {
    return `This action updates a #${id} actionTarget`;
  }

  remove(id: number) {
    return `This action removes a #${id} actionTarget`;
  }
}
