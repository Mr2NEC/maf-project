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
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class GameTypesService {
  constructor(
    @InjectRepository(GameType)
    private readonly gameTypeRepository: Repository<GameType>,
    private readonly gameTypeRolesService: GameTypeRolesService,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(): Promise<GameType[]> {
    return this.gameTypeRepository.find({
      relations: ['gameTypeRoles', 'gameTypeRoles.role'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<GameType> {
    const gameType = await this.gameTypeRepository.findOne({
      where: { id },
      relations: ['gameTypeRoles', 'gameTypeRoles.role'],
    });

    if (!gameType) {
      throw new NotFoundException(`Game type with id ${id} not found`);
    }

    return gameType;
  }

  async create(data: CreateGameTypeInput): Promise<GameType> {
    const { name, playersCount, gameTypeRoles, description } = data;

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

    const totalRoles = gameTypeRoles.reduce((sum, role) => sum + role.count, 0);

    if (totalRoles !== playersCount) {
      throw new BadRequestException(
        `Total roles count (${totalRoles}) must match players count (${playersCount})`,
      );
    }

    // Validate every role before writing anything
    for (const { roleId } of gameTypeRoles) {
      await this.rolesService.findOne(roleId);
    }

    // The game type must be saved first: its id is the roles' foreign key
    const gameType = await this.gameTypeRepository.save(
      this.gameTypeRepository.create({ name, playersCount, description }),
    );

    for (const { roleId, count } of gameTypeRoles) {
      await this.gameTypeRolesService.create({
        gameTypeId: gameType.id,
        roleId,
        count,
      });
    }

    return this.findOne(gameType.id);
  }

  async update(id: number, data: UpdateGameTypeInput): Promise<GameType> {
    const { name, playersCount, gameTypeRoles = [], description } = data;

    const gameType = await this.findOne(id);
    if (!gameType) {
      throw new NotFoundException(`Game type with id ${id} not found`);
    }

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

    if (description) {
      gameType.description = description;
    }

    if (Array.isArray(gameTypeRoles) && gameTypeRoles.length > 0) {
      const existingRoleIds = new Set(
        gameType.gameTypeRoles.map(gameTypeRole => gameTypeRole.roleId),
      );
      const rolesToAdd = gameTypeRoles.filter(
        gameTypeRole =>
          gameTypeRole.roleId && !existingRoleIds.has(gameTypeRole.roleId),
      );
      const rolesToRemove = gameType.gameTypeRoles.filter(
        gameTypeRole =>
          !gameTypeRoles.some(
            newRole => newRole.roleId === gameTypeRole.roleId,
          ),
      );

      if (rolesToRemove.length > 0) {
        await this.gameTypeRolesService.removeBatch(
          rolesToRemove.map(role => role.id),
        );
        gameType.gameTypeRoles = gameType.gameTypeRoles.filter(
          role => !rolesToRemove.some(removeRole => removeRole.id === role.id),
        );
      }

      if (rolesToAdd.length > 0) {
        const newRoles = await Promise.all(
          rolesToAdd.map(gameTypeRole =>
            this.gameTypeRolesService.create({
              gameTypeId: gameType.id,
              roleId: gameTypeRole.roleId,
              count: gameTypeRole.count,
            }),
          ),
        );
        gameType.gameTypeRoles.push(...newRoles);
      }
    }

    const totalRoles = gameType.gameTypeRoles.reduce(
      (sum, role) => sum + role.count,
      0,
    );

    if (playersCount) {
      if (playersCount < 2) {
        throw new BadRequestException('Players count must be at least 2');
      }
      gameType.playersCount = playersCount;
    }

    if (totalRoles !== gameType.playersCount) {
      throw new BadRequestException(
        `Total roles count (${totalRoles}) must match players count (${playersCount})`,
      );
    }

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
