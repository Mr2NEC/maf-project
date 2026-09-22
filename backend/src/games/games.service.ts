import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { DateUtils } from 'src/common/utils/date.utils';
import { GameTypesService } from 'src/game-types/game-types.service';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { GameStatus } from 'src/enums/game-status.enum';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    private readonly gameTypesService: GameTypesService,
  ) {}

  findAll({ skip, take }: PaginationArgs): Promise<Game[]> {
    return this.gamesRepository.find({
      relations: ['gameType', 'players', 'players.user', 'players.role'],
      order: { startDate: 'DESC', id: 'DESC' },
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id },
      relations: ['gameType', 'players', 'players.user', 'players.role'],
      order: { players: { seatNumber: 'ASC' } },
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
    const { gameTypeId, startDate } = input;
    const game = await this.findOne(id);

    if (game.status !== GameStatus.WAITING) {
      throw new BadRequestException(
        'Only a game that has not started can be edited',
      );
    }

    const changes: Partial<Game> = {};
    if (gameTypeId !== undefined && gameTypeId !== game.gameTypeId) {
      changes.gameTypeId = (await this.gameTypesService.findOne(gameTypeId)).id;
    }
    if (startDate !== undefined) {
      assertNotInPast(startDate);
      changes.startDate = startDate;
    }

    // update() instead of save(): saving a game with its loaded players would
    // also write that (possibly stale) relation
    if (Object.keys(changes).length > 0) {
      await this.gamesRepository.update(id, changes);
    }
    return this.findOne(id);
  }

  /** Games with results are kept for history; cancel them instead. */
  async delete(id: number): Promise<Game> {
    const game = await this.findOne(id);
    if (!DELETABLE_STATUSES.includes(game.status)) {
      throw new BadRequestException(
        'A started or finished game cannot be deleted; cancel it instead',
      );
    }
    await this.gamesRepository.delete(id);
    return game;
  }
}

const DELETABLE_STATUSES = [GameStatus.WAITING, GameStatus.CANCELLED];

function assertNotInPast(date: Date): void {
  if (!DateUtils.isTodayOrFuture(date)) {
    throw new BadRequestException('Start date must be today or in the future');
  }
}
