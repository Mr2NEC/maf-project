import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameInput } from './dto/create-game.input';
import { GameTypesService } from 'src/game-types/game-types.service';
import { UpdateGameInput } from './dto/update-game.input';
import { DateUtils } from 'src/common/utils/date.utils';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gamesRepository: Repository<Game>,
    private gameTypesRepository: GameTypesService,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gamesRepository.find({ relations: ['gameType', 'players'] });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id },
      relations: ['gameType', 'players'],
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async create(data: CreateGameInput): Promise<Game> {
    const { gameTypeId, startDate } = data;

    if (!gameTypeId) {
      throw new BadRequestException('Game type is required');
    }

    const gameType = await this.gameTypesRepository.findOne(gameTypeId);

    if (!DateUtils.isTodayOrFuture(startDate)) {
      throw new BadRequestException(
        'Start date must be today or in the future',
      );
    }

    const newGame = this.gamesRepository.create({ gameType, startDate });
    return this.gamesRepository.save(newGame);
  }

  async update(id: number, data: UpdateGameInput): Promise<Game> {
    const { gameTypeId, startDate, status, currentRound } = data;
    const game = await this.findOne(id);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (gameTypeId && gameTypeId !== game.gameType.id) {
      const gameType = await this.gameTypesRepository.findOne(gameTypeId);
      if (!gameType) {
        throw new NotFoundException('Game type not found');
      }
      game.gameType = gameType;
    }

    if (startDate && !DateUtils.isTodayOrFuture(startDate)) {
      throw new BadRequestException(
        'Start date must be today or in the future',
      );
    } else if (startDate) {
      game.startDate = startDate;
    }

    if (status) {
      game.status = status;
    }

    if (currentRound && currentRound >= game.currentRound) {
      game.currentRound = currentRound;
    }

    return this.gamesRepository.save(game);
  }

  async delete(id: number) {
    const game = await this.findOne(id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return this.gamesRepository.delete(id);
  }
}
