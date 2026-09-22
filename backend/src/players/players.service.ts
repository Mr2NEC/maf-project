import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Player } from './entities/player.entity';
import { CreatePlayerInput } from './dto/create-player.input';
import { UpdatePlayerInput } from './dto/update-player.input';
import { UsersService } from 'src/users/users.service';
import { GamesService } from 'src/games/games.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private playersRepository: Repository<Player>,
    private usersService: UsersService,
    private gamesService: GamesService,
    private rolesService: RolesService,
  ) {}

  async create(data: CreatePlayerInput) {
    const { userId, gameId, roleId, seatNumber, username } = data;

    if (!userId || !gameId) {
      throw new BadRequestException('User and game are required');
    }

    const user = await this.usersService.findOne(userId);
    const game = await this.gamesService.findOne(gameId);

    if (!user || !game) {
      throw new BadRequestException('User or game not found');
    }

    const player = this.playersRepository.create({
      user,
      game,
      username: username ?? user.username,
    });

    if (roleId) {
      const role = await this.rolesService.findOne(roleId);
      player.role = role;
    }

    if (seatNumber) {
      player.seatNumber = seatNumber;
    }

    return this.playersRepository.save(player);
  }

  async findOne(id: number) {
    return this.playersRepository.findOne({
      where: { id },
      relations: ['user', 'game', 'role'],
    });
  }

  async findAll(options?: FindManyOptions<Player>) {
    return this.playersRepository.find({
      relations: ['user', 'game', 'role'],
      ...options,
    });
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    if (!player) {
      throw new Error('Player not found');
    }
    return this.playersRepository.delete({ id });
  }

  async update(id: number, data: UpdatePlayerInput) {
    const { userId, gameId, roleId, seatNumber, username } = data;

    const player = await this.findOne(id);
    if (!player) {
      throw new Error('Player not found');
    }

    if (userId) {
      const user = await this.usersService.findOne(userId);
      player.user = user;
    }

    if (gameId) {
      const game = await this.gamesService.findOne(gameId);
      if (!game) {
        throw new Error('Game not found');
      }
      player.game = game;
    }

    if (roleId) {
      const role = await this.rolesService.findOne(roleId);
      if (!role) {
        throw new Error('Role not found');
      }
      player.role = role;
    }

    if (seatNumber) {
      player.seatNumber = seatNumber;
    }

    if (username) {
      player.username = username;
    }

    return this.playersRepository.save({ ...player });
  }
}
