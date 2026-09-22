import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError, Repository } from 'typeorm';
import { JwtUser } from 'src/auth/types/jwt-user';
import { ClubAccessService } from 'src/club-members/club-access.service';
import { GameStatus } from 'src/enums/game-status.enum';
import { TournamentStatus } from 'src/enums/tournament-status.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { GameType } from 'src/game-types/entities/game-type.entity';
import { GameTypesService } from 'src/game-types/game-types.service';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

const TODAY = new Date(2026, 8, 22, 12, 0);
const TOMORROW = new Date(2026, 8, 23, 19, 0);
const YESTERDAY = new Date(2026, 8, 21, 19, 0);

describe('GamesService', () => {
  const classic = { id: 1, name: 'classic' } as GameType;
  const sport = { id: 2, name: 'sport' } as GameType;
  const host: JwtUser = { userId: 5, role: UserRole.USER };

  let repository: Record<'findOne' | 'insert' | 'update' | 'delete', jest.Mock>;
  let tournaments: { findOneBy: jest.Mock };
  let gameTypes: jest.Mocked<Pick<GameTypesService, 'findOne'>>;
  let access: { assertCanHost: jest.Mock };
  let service: GamesService;

  function storedGame(overrides: Partial<Game> = {}): Game {
    return {
      id: 7,
      status: GameStatus.WAITING,
      currentRound: 2,
      gameType: classic,
      gameTypeId: 1,
      clubId: 3,
      startDate: TOMORROW,
      ...overrides,
    } as Game;
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);

    repository = {
      findOne: jest.fn().mockResolvedValue(storedGame()),
      insert: jest.fn().mockResolvedValue({ identifiers: [{ id: 7 }] }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
    };
    tournaments = { findOneBy: jest.fn() };
    gameTypes = {
      findOne: jest.fn(id =>
        id === 1
          ? Promise.resolve(classic)
          : id === 2
            ? Promise.resolve(sport)
            : Promise.reject(new NotFoundException()),
      ),
    };
    access = { assertCanHost: jest.fn().mockResolvedValue(undefined) };
    service = new GamesService(
      repository as unknown as Repository<Game>,
      tournaments as unknown as Repository<Tournament>,
      gameTypes as unknown as GameTypesService,
      access as unknown as ClubAccessService,
    );
  });

  afterEach(() => jest.useRealTimers());

  describe('create', () => {
    it('creates a club game for a future date', async () => {
      await service.create(host, {
        gameTypeId: 1,
        startDate: TOMORROW,
        clubId: 3,
      });

      expect(access.assertCanHost).toHaveBeenCalledWith(host, 3);
      expect(repository.insert).toHaveBeenCalledWith({
        gameTypeId: 1,
        startDate: TOMORROW,
        clubId: 3,
        tournamentId: null,
      });
    });

    it('takes the club from the tournament', async () => {
      tournaments.findOneBy.mockResolvedValue({
        id: 9,
        clubId: 4,
        status: TournamentStatus.ACTIVE,
      });

      await service.create(host, {
        gameTypeId: 1,
        startDate: TOMORROW,
        tournamentId: 9,
      });

      expect(access.assertCanHost).toHaveBeenCalledWith(host, 4);
      expect(repository.insert).toHaveBeenCalledWith(
        expect.objectContaining({ clubId: 4, tournamentId: 9 }),
      );
    });

    it('rejects a tournament of another club or a finished one', async () => {
      tournaments.findOneBy.mockResolvedValue({
        id: 9,
        clubId: 4,
        status: TournamentStatus.ACTIVE,
      });
      await expect(
        service.create(host, {
          gameTypeId: 1,
          startDate: TOMORROW,
          clubId: 3,
          tournamentId: 9,
        }),
      ).rejects.toThrow(/another club/);

      tournaments.findOneBy.mockResolvedValue({
        id: 9,
        clubId: 4,
        status: TournamentStatus.FINISHED,
      });
      await expect(
        service.create(host, {
          gameTypeId: 1,
          startDate: TOMORROW,
          tournamentId: 9,
        }),
      ).rejects.toThrow(/finished/);
    });

    it('does not let a non-host create a game', async () => {
      access.assertCanHost.mockRejectedValue(new ForbiddenException());

      await expect(
        service.create(host, { gameTypeId: 1, startDate: TOMORROW, clubId: 3 }),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.insert).not.toHaveBeenCalled();
    });

    it('rejects a start date in the past and an unknown game type', async () => {
      await expect(
        service.create(host, {
          gameTypeId: 1,
          startDate: YESTERDAY,
          clubId: 3,
        }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(host, {
          gameTypeId: 99,
          startDate: TOMORROW,
          clubId: 3,
        }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.insert).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('throws EntityNotFoundError (mapped to NOT_FOUND) for a missing game', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it("checks host rights for the game's club and changes only the given fields", async () => {
      await service.update(host, 7, { startDate: TOMORROW });

      expect(access.assertCanHost).toHaveBeenCalledWith(host, 3);
      expect(repository.update).toHaveBeenCalledWith(7, {
        startDate: TOMORROW,
      });
    });

    it('switches the game type', async () => {
      await service.update(host, 7, { gameTypeId: 2 });

      expect(repository.update).toHaveBeenCalledWith(7, { gameTypeId: 2 });
    });

    it('does not edit a game that has started', async () => {
      repository.findOne.mockResolvedValue(
        storedGame({ status: GameStatus.IN_PROGRESS }),
      );

      await expect(
        service.update(host, 7, { startDate: TOMORROW }),
      ).rejects.toThrow(BadRequestException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('rejects moving the game into the past', async () => {
      await expect(
        service.update(host, 7, { startDate: YESTERDAY }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('deletes a game that has not started', async () => {
      await expect(service.delete(host, 7)).resolves.toMatchObject({ id: 7 });
      expect(repository.delete).toHaveBeenCalledWith(7);
    });

    it('keeps finished games for history', async () => {
      repository.findOne.mockResolvedValue(
        storedGame({ status: GameStatus.FINISHED }),
      );

      await expect(service.delete(host, 7)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
