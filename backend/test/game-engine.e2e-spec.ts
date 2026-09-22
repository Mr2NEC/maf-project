import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { databaseConfig, DatabaseConfig } from 'src/config/database.config';
import { UserRole } from 'src/enums/user-role.enum';
import { EntityNotFoundFilter } from 'src/entity-not-found/entity-not-found.filter';
import { User } from 'src/users/entities/user.entity';

type GqlResponse<T = any> = {
  data?: T;
  errors?: { message: string; extensions?: { code?: string } }[];
};

/** Starts from an empty database; migrations create the schema and seed data. */
async function recreateDatabase(): Promise<void> {
  const db = databaseConfig() as DatabaseConfig;
  const admin = new DataSource({
    type: 'mysql',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
  });
  await admin.initialize();
  await admin.query(`DROP DATABASE IF EXISTS \`${db.name}\``);
  await admin.query(
    `CREATE DATABASE \`${db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`,
  );
  await admin.destroy();
}

describe('Game engine (e2e)', () => {
  let app: INestApplication;
  let hostToken: string;
  let userIds: number[];

  async function gql<T = any>(
    query: string,
    token: string | null = hostToken,
  ): Promise<GqlResponse<T>> {
    const req = request(app.getHttpServer()).post('/graphql').send({ query });
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }
    return (await req).body as GqlResponse<T>;
  }

  const code = (r: GqlResponse) => r.errors?.[0]?.extensions?.code;
  const message = (r: GqlResponse) => r.errors?.[0]?.message ?? '';

  beforeAll(async () => {
    await recreateDatabase();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication({ logger: false });
    app.useGlobalFilters(new EntityNotFoundFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Sign-up is rate limited; create users directly and sign a host token
    const users = app.get(DataSource).getRepository(User);
    const created = await users.save(
      Array.from({ length: 11 }, (_, i) =>
        users.create({
          username: i === 10 ? 'host' : `player${i + 1}`,
          email: i === 10 ? 'host@e2e.test' : `p${i + 1}@e2e.test`,
          role: i === 10 ? UserRole.HOST : UserRole.USER,
        }),
      ),
    );
    userIds = created.slice(0, 10).map(u => u.id);
    hostToken = await app
      .get(JwtService)
      .signAsync({ sub: { userId: created[10].id } });
  });

  afterAll(async () => {
    await app?.close();
  });

  it('plays a classic game from seating to the town win', async () => {
    // Reference data comes from the SeedClassicMafia migration
    const ref = await gql<{
      gameTypes: { id: string; playersCount: number }[];
      roles: { id: number; name: string }[];
      actionTypes: { id: string; effect: string }[];
    }>(
      '{ gameTypes { id playersCount } roles { id name } actionTypes { id effect } }',
      null,
    );
    const gameTypeId = ref.data!.gameTypes.find(t => t.playersCount === 10)!.id;
    const role = (name: string) =>
      ref.data!.roles.find(r => r.name === name)!.id;
    const action = (effect: string) =>
      ref.data!.actionTypes.find(a => a.effect === effect)!.id;
    const [CIV, SHERIFF, DOCTOR, MAFIA] = [
      'Мирний',
      'Комісар',
      'Лікар',
      'Мафія',
    ].map(role);
    const [KILL, HEAL, CHECK] = ['KILL', 'HEAL', 'CHECK'].map(action);

    const created = await gql<{ createGame: { id: string } }>(
      `mutation { createGame(data: { gameTypeId: ${gameTypeId}, startDate: "2030-01-01T19:00:00.000Z" }) { id } }`,
    );
    const gameId = Number(created.data!.createGame.id);

    // Seating: seats are given in order
    let players: { id: string; seatNumber: number }[] = [];
    for (const userId of userIds) {
      const r = await gql<{ addPlayerToGame: { players: typeof players } }>(
        `mutation { addPlayerToGame(gameId: ${gameId}, input: { userId: ${userId} }) { players { id seatNumber } } }`,
      );
      players = r.data!.addPlayerToGame.players;
    }
    expect(players.map(p => p.seatNumber)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    const P: Record<number, number> = Object.fromEntries(
      players.map(p => [p.seatNumber, Number(p.id)]),
    );

    // Cards dealt at the table: 1-5 town, 6 sheriff, 7 doctor, 8-10 mafia
    const cards: Record<number, number> = {
      1: CIV,
      2: CIV,
      3: CIV,
      4: CIV,
      5: CIV,
      6: SHERIFF,
      7: DOCTOR,
      8: MAFIA,
      9: MAFIA,
      10: MAFIA,
    };
    const deal = Object.entries(cards)
      .map(
        ([seat, roleId]) =>
          `{ playerId: ${P[Number(seat)]}, roleId: ${roleId} }`,
      )
      .join(',');
    expect(
      (
        await gql(
          `mutation { assignRoles(gameId: ${gameId}, input: { random: false, assignments: [${deal}] }) { id } }`,
        )
      ).errors,
    ).toBeUndefined();

    const started = await gql(
      `mutation { startGame(gameId: ${gameId}) { status phase currentRound } }`,
    );
    expect(started.data.startGame).toEqual({
      status: 'IN_PROGRESS',
      phase: 'NIGHT',
      currentRound: 1,
    });

    // Spectators must not see roles while the game runs
    const spectator = await gql(
      `{ game(id: ${gameId}) { players { roleId role { name } } } }`,
      null,
    );
    expect(
      spectator.data.game.players.every(
        (p: { role: unknown; roleId: unknown }) =>
          p.role === null && p.roleId === null,
      ),
    ).toBe(true);

    const night = (seat: number, type: string | number, target: number) =>
      gql(
        `mutation { recordNightAction(gameId: ${gameId}, input: { actorId: ${P[seat]}, actionTypeId: ${type}, targetId: ${P[target]} }) { id } }`,
      );
    const endNight = () =>
      gql(
        `mutation { endNight(gameId: ${gameId}) { killed { seatNumber } saved { seatNumber } checks { team } game { phase currentRound } } }`,
      );
    const endDay = (votes: [number, number[]][], tieBreak?: string) =>
      gql(
        `mutation { endDay(gameId: ${gameId}, input: { votes: [${votes
          .map(
            ([t, v]) =>
              `{ targetId: ${P[t]}, voterIds: [${v.map(s => P[s]).join(',')}] }`,
          )
          .join(
            ',',
          )}]${tieBreak ? `, tieBreak: ${tieBreak}` : ''} }) { tie eliminated { seatNumber } game { phase currentRound } } }`,
      );

    // Night 1: the doctor saves the mafia's target, the sheriff finds a mafia
    expect(message(await night(2, KILL, 1))).toMatch(/cannot use/);
    expect((await night(8, KILL, 1)).errors).toBeUndefined();
    expect(message(await night(9, KILL, 2))).toMatch(/already shot/);
    expect((await night(7, HEAL, 1)).errors).toBeUndefined();
    expect((await night(6, CHECK, 8)).errors).toBeUndefined();

    const night1 = (await endNight()).data.endNight;
    expect(night1.killed).toEqual([]);
    expect(night1.saved).toEqual([{ seatNumber: 1 }]);
    expect(night1.checks).toEqual([{ team: 'MAFIA' }]);
    expect(night1.game).toEqual({ phase: 'DAY', currentRound: 1 });

    // Day 1: seat 8 is voted out
    const day1 = (
      await endDay([
        [8, [1, 2, 3, 4, 5, 6]],
        [1, [8, 9, 10]],
      ])
    ).data.endDay;
    expect(day1.eliminated).toEqual([{ seatNumber: 8 }]);
    expect(day1.game).toEqual({ phase: 'NIGHT', currentRound: 2 });

    // Night 2: the sheriff is killed
    expect(message(await night(8, KILL, 1))).toMatch(/out of the game/);
    await night(9, KILL, 6);
    expect((await endNight()).data.endNight.killed).toEqual([
      { seatNumber: 6 },
    ]);

    // Day 2: a tie changes nothing until the host settles it
    const tie = (
      await endDay([
        [9, [1, 2]],
        [2, [9, 10]],
      ])
    ).data.endDay;
    expect(tie.tie).toBe(true);
    expect(tie.game.phase).toBe('DAY');
    const day2 = (
      await endDay(
        [
          [9, [1, 2]],
          [2, [9, 10]],
        ],
        'ELIMINATE_ALL',
      )
    ).data.endDay;
    expect(day2.eliminated).toEqual([{ seatNumber: 2 }, { seatNumber: 9 }]);

    // The last mafia collects 4 fouls: disqualified, town wins
    let finished: any;
    for (let i = 0; i < 4; i++) {
      finished = (
        await gql(
          `mutation { addFoul(gameId: ${gameId}, playerId: ${P[10]}) { status winnerTeam players { seatNumber status points } } }`,
        )
      ).data.addFoul;
    }
    expect(finished.status).toBe('FINISHED');
    expect(finished.winnerTeam).toBe('TOWN');
    const points = Object.fromEntries(
      finished.players.map((p: { seatNumber: number; points: number }) => [
        p.seatNumber,
        p.points,
      ]),
    );
    expect(points).toEqual({
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 0,
      9: 0,
      10: 0,
    });

    const bonus = await gql(
      `mutation { awardBonus(gameId: ${gameId}, input: { playerId: ${P[7]}, points: 0.5 }) { players { seatNumber points } } }`,
    );
    expect(
      bonus.data.awardBonus.players.find(
        (p: { seatNumber: number }) => p.seatNumber === 7,
      ).points,
    ).toBe(1.5);

    // After the game roles are public; the log stays with the host
    const revealed = await gql(
      `{ game(id: ${gameId}) { players { seatNumber role { team } } } }`,
      null,
    );
    expect(
      revealed.data.game.players.find(
        (p: { seatNumber: number }) => p.seatNumber === 8,
      ).role,
    ).toEqual({ team: 'MAFIA' });

    expect(code(await gql(`{ actions(gameId: ${gameId}) { id } }`, null))).toBe(
      'UNAUTHENTICATED',
    );
    const log = await gql(
      `{ actions(gameId: ${gameId}, take: 100) { phase actionType { effect } } }`,
    );
    expect(
      log.data.actions.filter((a: { phase: string }) => a.phase === 'NIGHT'),
    ).toHaveLength(4);
    expect(
      log.data.actions.filter(
        (a: { actionType: { effect: string } }) =>
          a.actionType.effect === 'VOTE',
      ),
    ).toHaveLength(13);

    // Rating: seat 7 (town + best-move bonus) leads, mafia players have 0
    const rating = await gql(
      '{ rating { place points games wins user { username } } }',
      null,
    );
    expect(rating.data.rating[0]).toEqual({
      place: 1,
      points: 1.5,
      games: 1,
      wins: 1,
      user: { username: 'player7' },
    });
    expect(rating.data.rating).toHaveLength(10);
    expect(rating.data.rating.at(-1).points).toBe(0);

    expect(code(await endNight())).toBe('BAD_REQUEST');
    expect(
      code(await gql(`mutation { deleteGame(id: ${gameId}) { id } }`)),
    ).toBe('BAD_REQUEST');
  });

  it('deals roles randomly by the game type composition and deletes a cancelled game', async () => {
    const created = await gql(
      'mutation { createGame(data: { gameTypeId: 1, startDate: "2030-01-02T19:00:00.000Z" }) { id } }',
    );
    const gameId = Number(created.data.createGame.id);
    for (const userId of userIds) {
      await gql(
        `mutation { addPlayerToGame(gameId: ${gameId}, input: { userId: ${userId} }) { id } }`,
      );
    }

    const dealt = await gql(
      `mutation { assignRoles(gameId: ${gameId}, input: { random: true }) { players { role { name } } } }`,
    );
    const counts: Record<string, number> = {};
    for (const p of dealt.data.assignRoles.players as {
      role: { name: string };
    }[]) {
      counts[p.role.name] = (counts[p.role.name] ?? 0) + 1;
    }
    expect(counts).toEqual({ Мирний: 5, Комісар: 1, Лікар: 1, Мафія: 3 });

    expect(
      (await gql(`mutation { cancelGame(gameId: ${gameId}) { status } }`)).data
        .cancelGame,
    ).toEqual({
      status: 'CANCELLED',
    });
    const deleted = await gql(`mutation { deleteGame(id: ${gameId}) { id } }`);
    expect(Number(deleted.data.deleteGame.id)).toBe(gameId);
  });

  it('finds users by name and lists upcoming games for the calendar', async () => {
    const found = await gql('{ users(search: "player1") { username } }', null);
    expect(
      found.data.users.map((u: { username: string }) => u.username),
    ).toEqual(['player1', 'player10']);

    // LIKE wildcards in the search are matched literally
    const wildcard = await gql('{ users(search: "%") { id } }', null);
    expect(wildcard.data.users).toEqual([]);
    const underscore = await gql('{ users(search: "player_") { id } }', null);
    expect(underscore.data.users).toEqual([]);

    await gql(
      'mutation { createGame(data: { gameTypeId: 1, startDate: "2031-05-01T19:00:00.000Z" }) { id } }',
    );
    await gql(
      'mutation { createGame(data: { gameTypeId: 1, startDate: "2031-03-01T19:00:00.000Z" }) { id } }',
    );
    const upcoming = await gql(
      '{ games(statuses: [WAITING], from: "2031-01-01T00:00:00.000Z") { startDate status } }',
      null,
    );
    expect(
      upcoming.data.games.map((g: { startDate: string }) => g.startDate),
    ).toEqual(['2031-03-01T19:00:00.000Z', '2031-05-01T19:00:00.000Z']);
  });

  it('keeps regular users out of host commands', async () => {
    const userToken = await app
      .get(JwtService)
      .signAsync({ sub: { userId: userIds[0] } });

    const r = await gql('mutation { startGame(gameId: 1) { id } }', userToken);

    expect(code(r)).toBe('FORBIDDEN');
  });
});
