import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameTypeRoleInput } from './dto/create-game-type-role.input';
import { UpdateGameTypeRoleInput } from './dto/update-game-type-role.input';
import { GameTypeRole } from './entities/game-type-role.entity';
import { FindManyOptions, Repository } from 'typeorm';
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
    const { gameType, role, count } = createGameTypeRoleInput;

    if (count < 1) {
      throw new BadRequestException('Count must be greater than 0');
    }

    if (!gameType) {
      throw new BadRequestException('Game type is required');
    }

    if (!role) {
      throw new BadRequestException('Role is required');
    }

    const gameTypeRole = this.gameTypeRolesRepository.create({
      gameType,
      role,
      count,
      roleId: role.id,
      gameTypeId: gameType.id,
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
      throw new NotFoundException('Game type role not found');
    }

    return gameTypeRole;
  }

  async update(id: number, updateGameTypeRoleInput: UpdateGameTypeRoleInput) {
    const { gameType, role, count } = updateGameTypeRoleInput;
    const gameTypeRole = await this.findOne(id);

    if (!gameTypeRole) {
      throw new NotFoundException('Game type role not found');
    }

    if (gameType) {
      gameTypeRole.gameType = gameType;
    }

    if (role) {
      gameTypeRole.role = role;
    }

    if (count) {
      gameTypeRole.count = count;
    }

    return this.gameTypeRolesRepository.save(gameTypeRole);
  }

  async remove(id: number) {
    const gameTypeRole = await this.findOne(id);

    if (!gameTypeRole) {
      throw new NotFoundException('Game type role not found');
    }

    return this.gameTypeRolesRepository.delete(id);
  }
}
