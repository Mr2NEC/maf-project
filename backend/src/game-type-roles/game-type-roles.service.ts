import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameTypeRoleInput } from './dto/create-game-type-role.input';
import { GameTypeRole } from './entities/game-type-role.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameTypeRolesService {
  constructor(
    @InjectRepository(GameTypeRole)
    private gameTypeRolesRepository: Repository<GameTypeRole>,
  ) {}

  async create(
    createGameTypeRoleInput: CreateGameTypeRoleInput,
  ): Promise<GameTypeRole> {
    const { gameTypeId, roleId, count } = createGameTypeRoleInput;

    if (count < 1) {
      throw new BadRequestException('Count must be greater than 0');
    }

    const gameTypeRole = this.gameTypeRolesRepository.create({
      roleId,
      gameTypeId,
      count,
    });

    return this.gameTypeRolesRepository.save(gameTypeRole);
  }

  findAll(options: FindManyOptions<GameTypeRole> = {}) {
    return this.gameTypeRolesRepository.find({
      relations: ['gameType', 'role'],
      ...options,
    });
  }

  async findOne(id: number) {
    const gameTypeRole = await this.gameTypeRolesRepository.findOne({
      where: { id },
      relations: ['gameType', 'role'],
    });

    if (!gameTypeRole) {
      throw new NotFoundException(`GameTypeRole with id ${id} not found`);
    }

    return gameTypeRole;
  }

  async removeBatch(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.gameTypeRolesRepository.delete({ id: In(ids) });
  }

  async remove(id: number) {
    const gameTypeRole = await this.findOne(id);

    if (!gameTypeRole) {
      throw new NotFoundException(`GameTypeRole with id ${id} not found`);
    }

    return this.gameTypeRolesRepository.delete(id);
  }
}
