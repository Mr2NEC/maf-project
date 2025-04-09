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
import { RolesService } from 'src/roles/roles.service';
import { GameTypesService } from 'src/game-types/game-types.service';

@Injectable()
export class GameTypeRolesService {
  constructor(
    @InjectRepository(GameTypeRole)
    private gameTypeRolesRepository: Repository<GameTypeRole>,
    private readonly gameTypesService: GameTypesService,
    private readonly rolesService: RolesService,
  ) {}

  async create(
    createGameTypeRoleInput: CreateGameTypeRoleInput,
  ): Promise<GameTypeRole> {
    const { gameTypeId, roleId, count } = createGameTypeRoleInput;

    const gameType = await this.gameTypesService.findOne(gameTypeId);

    if (!gameType) {
      throw new NotFoundException('Game type not found');
    }

    const role = await this.rolesService.findOne(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (count < 1) {
      throw new BadRequestException('Count must be greater than 0');
    }

    const gameTypeRole = this.gameTypeRolesRepository.create({
      gameType,
      role,
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

  findOne(id: number) {
    return this.gameTypeRolesRepository.findOne({
      where: { id },
      relations: ['gameType', 'role'],
    });
  }

  async update(id: number, updateGameTypeRoleInput: UpdateGameTypeRoleInput) {
    const { gameTypeId, roleId, count } = updateGameTypeRoleInput;
    const gameTypeRole = await this.findOne(id);

    if (!gameTypeRole) {
      throw new NotFoundException('Game type role not found');
    }

    const gameType = gameTypeId
      ? await this.gameTypesService.findOne(gameTypeId)
      : gameTypeRole.gameType;
    const role = roleId
      ? await this.rolesService.findOne(roleId)
      : gameTypeRole.role;

    return this.gameTypeRolesRepository.update(id, { gameType, role, count });
  }

  remove(id: number) {
    return this.gameTypeRolesRepository.delete(id);
  }
}
