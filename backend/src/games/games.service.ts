import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { DateUtils } from 'src/common/utils/date.utils';
import { GameTypesService } from 'src/game-types/game-types.service';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    private readonly gameTypesService: GameTypesService,
  ) {}

  findAll({ skip, take }: PaginationArgs): Promise<Game[]> {
    return this.gamesRepository.find({
      relations: ['gameType', 'players'],
      order: { startDate: 'DESC', id: 'DESC' },
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id },
      relations: ['gameType', 'players'],
    });
    if (!game) {
      throw new EntityNotFoundError(Game, { id });
    }
    return game;
  }

  async create({ gameTypeId, startDate }: CreateGameInput): Promise<Game> {
    assertNotInPast(startDate);
    // Throws NotFound for an unknown game type
    const gameType = await this.gameTypesService.findOne(gameTypeId);

    const game = this.gamesRepository.create({ gameType, startDate });
    return this.gamesRepository.save(game);
  }

  async update(id: number, input: UpdateGameInput): Promise<Game> {
    const { gameTypeId, startDate, status, currentRound } = input;
    const game = await this.findOne(id);

    if (gameTypeId !== undefined && gameTypeId !== game.gameType.id) {
      game.gameType = await this.gameTypesService.findOne(gameTypeId);
    }

    if (startDate !== undefined) {
      assertNotInPast(startDate);
      game.startDate = startDate;
    }

    if (status !== undefined) {
      game.status = status;
    }

    if (currentRound !== undefined) {
      if (currentRound < game.currentRound) {
        throw new BadRequestException(
          `Round cannot go back from ${game.currentRound} to ${currentRound}`,
        );
      }
      game.currentRound = currentRound;
    }

    return this.gamesRepository.save(game);
  }

  async delete(id: number): Promise<Game> {
    const game = await this.findOne(id);
    await this.gamesRepository.delete(id);
    return game;
  }
}

function assertNotInPast(date: Date): void {
  if (!DateUtils.isTodayOrFuture(date)) {
    throw new BadRequestException('Start date must be today or in the future');
  }
}
