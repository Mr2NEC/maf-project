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
import { DateUtils } from 'src/shared/utils/date.utils';
import { UpdateGameInput } from './dto/update-game.input';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gamesRepository: Repository<Game>,
    private gameTypesRepository: GameTypesService,
    private readonly dateUtils: DateUtils,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gamesRepository.find({ relations: ['gameType'] });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async create(data: CreateGameInput): Promise<Game> {
    const { gameTypeId, startDate } = data;
    const gameType = await this.gameTypesRepository.findOne(gameTypeId);

    if (!this.dateUtils.isTodayOrFuture(startDate)) {
      throw new BadRequestException(
        'Start date must be today or in the future',
      );
    }
    const newGame = this.gamesRepository.create({ gameType, startDate });
    return this.gamesRepository.save(newGame);
  }

  async update(id: number, data: UpdateGameInput): Promise<Game> {
    const { gameTypeId, startDate } = data;
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

    if (startDate && !this.dateUtils.isTodayOrFuture(startDate)) {
      throw new BadRequestException(
        'Start date must be today or in the future',
      );
    } else if (startDate) {
      game.startDate = startDate;
    }

    return this.gamesRepository.save(game);
  }
}
