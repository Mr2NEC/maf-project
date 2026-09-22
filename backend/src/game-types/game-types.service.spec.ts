import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GameTypeRolesService } from 'src/game-type-roles/game-type-roles.service';
import { RolesService } from 'src/roles/roles.service';
import { GameType } from './entities/game-type.entity';
import { GameTypesService } from './game-types.service';

describe('GameTypesService.create', () => {
  let repository: Record<'findOne' | 'create' | 'save', jest.Mock>;
  let gameTypeRoles: { create: jest.Mock };
  let roles: { findOne: jest.Mock };
  let service: GameTypesService;
  const calls: string[] = [];

  beforeEach(() => {
    calls.length = 0;
    repository = {
      // null for the name uniqueness check, the saved game type afterwards
      findOne: jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValue({ id: 5, gameTypeRoles: [] }),
      create: jest.fn((data: Partial<GameType>) => data),
      save: jest.fn((gameType: GameType) => {
        calls.push('save game type');
        return Promise.resolve({ ...gameType, id: 5 });
      }),
    };
    gameTypeRoles = {
      create: jest.fn(({ gameTypeId }: { gameTypeId: number }) => {
        calls.push(`create role for game type ${gameTypeId}`);
        return Promise.resolve({});
      }),
    };
    roles = {
      findOne: jest.fn((id: number) =>
        id === 404
          ? Promise.reject(new NotFoundException())
          : Promise.resolve({ id }),
      ),
    };
    service = new GameTypesService(
      repository as unknown as Repository<GameType>,
      gameTypeRoles as unknown as GameTypeRolesService,
      roles as unknown as RolesService,
    );
  });

  it('saves the game type before its roles, using the new id', async () => {
    await service.create({
      name: 'classic',
      playersCount: 10,
      gameTypeRoles: [
        { roleId: 1, count: 7 },
        { roleId: 2, count: 3 },
      ],
    });

    expect(calls).toEqual([
      'save game type',
      'create role for game type 5',
      'create role for game type 5',
    ]);
  });

  it('writes nothing when a role does not exist', async () => {
    await expect(
      service.create({
        name: 'classic',
        playersCount: 10,
        gameTypeRoles: [
          { roleId: 1, count: 7 },
          { roleId: 404, count: 3 },
        ],
      }),
    ).rejects.toThrow(NotFoundException);
    expect(calls).toEqual([]);
  });

  it('rejects role counts that do not add up to the players count', async () => {
    await expect(
      service.create({
        name: 'classic',
        playersCount: 10,
        gameTypeRoles: [{ roleId: 1, count: 9 }],
      }),
    ).rejects.toThrow(BadRequestException);
    expect(calls).toEqual([]);
  });
});
