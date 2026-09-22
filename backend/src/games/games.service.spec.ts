import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { GameStatus } from 'src/enums/game-status.enum';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { GameTypesService } from 'src/game-types/game-types.service';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

const TODAY = new Date(2026, 8, 22, 12, 0);
const TOMORROW = new Date(2026, 8, 23, 19, 0);
const YESTERDAY = new Date(2026, 8, 21, 19, 0);

describe('GamesService', () => {
  const classic = { id: 1, name: 'classic' } as GameType;
  const sport = { id: 2, name: 'sport' } as GameType;

  let repository: Record<
    'findOne' | 'create' | 'save' | 'update' | 'delete',
    jest.Mock
  >;
  let gameTypes: jest.Mocked<Pick<GameTypesService, 'findOne'>>;
  let service: GamesService;

  function storedGame(overrides: Partial<Game> = {}): Game {
    return {
      id: 7,
      status: GameStatus.WAITING,
      currentRound: 2,
      gameType: classic,
      gameTypeId: 1,
      startDate: TOMORROW,
      ...overrides,
    } as Game;
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);

    repository = {
      findOne: jest.fn().mockResolvedValue(storedGame()),
      create: jest.fn((data: Partial<Game>) => data),
      save: jest.fn((game: Game) => Promise.resolve(game)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
    };
    gameTypes = {
      findOne: jest.fn(id =>
        id === 1
          ? Promise.resolve(classic)
          : id === 2
            ? Promise.resolve(sport)
            : Promise.reject(new NotFoundException()),
      ),
    };
    service = new GamesService(
      repository as unknown as Repository<Game>,
      gameTypes as unknown as GameTypesService,
    );
  });

  afterEach(() => jest.useRealTimers());

  describe('create', () => {
    it('creates a game for a future date', async () => {
      const game = await service.create({
        gameTypeId: 1,
        startDate: TOMORROW,
      });

      expect(game).toMatchObject({ gameType: classic, startDate: TOMORROW });
    });

    it('rejects a start date in the past', async () => {
      await expect(
        service.create({ gameTypeId: 1, startDate: YESTERDAY }),
      ).rejects.toThrow(BadRequestException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('rejects an unknown game type', async () => {
      await expect(
        service.create({ gameTypeId: 99, startDate: TOMORROW }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('throws EntityNotFoundError (mapped to NOT_FOUND) for a missing game', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('changes only the provided fields', async () => {
      await service.update(7, { startDate: TOMORROW });

      expect(repository.update).toHaveBeenCalledWith(7, {
        startDate: TOMORROW,
      });
    });

    it('switches the game type', async () => {
      await service.update(7, { gameTypeId: 2 });

      expect(repository.update).toHaveBeenCalledWith(7, { gameTypeId: 2 });
    });

    it('does not edit a game that has started', async () => {
      repository.findOne.mockResolvedValue(
        storedGame({ status: GameStatus.IN_PROGRESS }),
      );

      await expect(service.update(7, { startDate: TOMORROW })).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('rejects moving the game into the past', async () => {
      await expect(service.update(7, { startDate: YESTERDAY })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('deletes a game that has not started', async () => {
      await expect(service.delete(7)).resolves.toMatchObject({ id: 7 });
      expect(repository.delete).toHaveBeenCalledWith(7);
    });

    it('keeps finished games for history', async () => {
      repository.findOne.mockResolvedValue(
        storedGame({ status: GameStatus.FINISHED }),
      );

      await expect(service.delete(7)).rejects.toThrow(BadRequestException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
