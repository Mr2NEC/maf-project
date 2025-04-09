import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameTypeRolesService } from 'src/game-type-roles/game-type-roles.service';
import { GameType } from './entities/game-type.entity';
import { CreateGameTypeInput } from './dto/create-game-type.input';
import { UpdateGameTypeInput } from './dto/update-game-type.input';
import { GameTypeRole } from 'src/game-type-roles/entities/game-type-role.entity';

@Injectable()
export class GameTypesService {
  constructor(
    @InjectRepository(GameType)
    private readonly gameTypeRepository: Repository<GameType>,
    private readonly gameTypeRolesRepository: GameTypeRolesService,
  ) {}

  async findAll(): Promise<GameType[]> {
    return this.gameTypeRepository.find({
      relations: ['roles', 'roles.role'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<GameType> {
    const gameType = await this.gameTypeRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });

    if (!gameType) {
      throw new NotFoundException(`Game type with id ${id} not found`);
    }

    return gameType;
  }

  async create(data: CreateGameTypeInput): Promise<GameType> {
    const { name, playersCount, roles, description } = data;

    const existingGameType = await this.gameTypeRepository.findOne({
      where: { name },
    });

    if (existingGameType) {
      throw new BadRequestException(
        `Game type with name "${name}" already exists`,
      );
    }

    if (playersCount < 2) {
      throw new BadRequestException('Players count must be at least 2');
    }

    const gameType = this.gameTypeRepository.create({
      name,
      playersCount,
      description,
    });

    const totalRoles = roles.reduce((sum, role) => sum + role.count, 0);

    if (totalRoles !== playersCount) {
      throw new BadRequestException(
        `Total roles count (${totalRoles}) must match players count (${playersCount})`,
      );
    }

    const gameTypeRoles: GameTypeRole[] = [];

    for (const role of roles) {
      const typeRole = await this.gameTypeRolesRepository.create({
        gameTypeId: gameType.id,
        roleId: role.roleId,
        count: role.count,
      });

      gameTypeRoles.push(typeRole);
    }

    gameType.roles = gameTypeRoles;

    return this.gameTypeRepository.save(gameType);
  }

  async update(id: number, data: UpdateGameTypeInput): Promise<GameType> {
    const gameType = await this.findOne(id);
    const { name, playersCount, roles = [], description } = data;

    if (name && name !== gameType.name) {
      const existingGameType = await this.gameTypeRepository.findOne({
        where: { name },
      });

      if (existingGameType) {
        throw new BadRequestException(
          `Game type with name "${name}" already exists`,
        );
      }

      gameType.name = name;
    }

    if (playersCount && playersCount < 2) {
      throw new BadRequestException('Players count must be at least 2');
    }

    gameType.playersCount = playersCount ?? gameType.playersCount;
    gameType.description = description ?? gameType.description;

    return this.gameTypeRepository.save(gameType);
  }

  async remove(id: number): Promise<void> {
    const gameType = await this.findOne(id);
    if (!gameType) {
      throw new NotFoundException(`Game type with id ${id} not found`);
    }
    await this.gameTypeRepository.remove(gameType);
  }
}
