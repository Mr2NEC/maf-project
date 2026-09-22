import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { databaseConfig, DatabaseConfig } from 'src/config/database.config';
import { EntityNotFoundFilter } from 'src/entity-not-found/entity-not-found.filter';
import { User } from 'src/users/entities/user.entity';

type Gql = {
  data?: any;
  errors?: { message: string; extensions?: { code?: string } }[];
};

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

describe('Clubs, rating rules and tournaments (e2e)', () => {
  let app: INestApplication;
  const tokens: Record<string, string> = {};
  let playerIds: number[] = [];
  const ids: Record<string, number> = {};

  async function gql(query: string, as: string | null): Promise<Gql> {
    const req = request(app.getHttpServer()).post('/graphql').send({ query });
    if (as) {
      req.set('Authorization', `Bearer ${tokens[as]}`);
    }
    return (await req).body as Gql;
  }
  const code = (r: Gql) => r.errors?.[0]?.extensions?.code;
  const message = (r: Gql) => r.errors?.[0]?.message ?? '';

  beforeAll(async () => {
    await recreateDatabase();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication({ logger: false });
    app.useGlobalFilters(new EntityNotFoundFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const users = app.get(DataSource).getRepository(User);
    const names = [
      'founder',
      'host',
      'outsider',
      ...Array.from({ length: 10 }, (_, i) => `p${i + 1}`),
    ];
    const created = await users.save(
      names.map(username =>
        users.create({ username, email: `${username}@clubs.test` }),
      ),
    );
    const jwt = app.get(JwtService);
    for (const user of created) {
      tokens[user.username] = await jwt.signAsync({ sub: { userId: user.id } });
      ids[user.username] = user.id;
    }
    playerIds = created.slice(3).map(u => u.id);
  });

  afterAll(async () => {
    await app?.close();
  });

  /** Seats the ten players, deals manual roles (seats 8-10 mafia) and starts. */
  async function startGame(gameId: number): Promise<Record<number, number>> {
    const roles = (await gql('{ roles { id name } }', null)).data.roles as {
      id: number;
      name: string;
    }[];
    const role = (name: string) => roles.find(r => r.name === name)!.id;
    let players: { id: string; seatNumber: number }[] = [];
    for (const userId of playerIds) {
      const r = await gql(
        `mutation { addPlayerToGame(gameId: ${gameId}, input: { userId: ${userId} }) { players { id seatNumber } } }`,
        'host',
      );
      players = r.data.addPlayerToGame.players;
    }
    const P = Object.fromEntries(
      players.map(p => [p.seatNumber, Number(p.id)]),
    );
    const cards: Record<number, string> = {
      1: 'Мирний',
      2: 'Мирний',
      3: 'Мирний',
      4: 'Мирний',
      5: 'Мирний',
      6: 'Комісар',
      7: 'Лікар',
      8: 'Мафія',
      9: 'Мафія',
      10: 'Мафія',
    };
    const deal = Object.entries(cards)
      .map(
        ([seat, name]) =>
          `{ playerId: ${P[Number(seat)]}, roleId: ${role(name)} }`,
      )
      .join(',');
    await gql(
      `mutation { assignRoles(gameId: ${gameId}, input: { random: false, assignments: [${deal}] }) { id } }`,
      'host',
    );
    await gql(`mutation { startGame(gameId: ${gameId}) { id } }`, 'host');
    return P;
  }

  /** Four fouls for each mafia player: the town wins. */
  async function townWinsByFouls(gameId: number, P: Record<number, number>) {
    let game: any;
    for (const seat of [8, 9, 10]) {
      for (let i = 0; i < 4; i++) {
        game = (
          await gql(
            `mutation { addFoul(gameId: ${gameId}, playerId: ${P[seat]}) { status winnerTeam players { seatNumber points bonus } } }`,
            'host',
          )
        ).data.addFoul;
      }
    }
    return game;
  }

  const pointsBySeat = (players: { seatNumber: number; points: number }[]) =>
    Object.fromEntries(players.map(p => [p.seatNumber, p.points]));

  it('creates a club, manages membership and roles', async () => {
    const club = await gql(
      'mutation { createClub(input: { title: "Мафія Київ", region: "Київ" }) { id title ratingRules { townWinPoints minGames } } }',
      'founder',
    );
    ids.club = Number(club.data.createClub.id);
    expect(club.data.createClub.ratingRules).toEqual({
      townWinPoints: 1,
      minGames: 0,
    });

    const dup = await gql(
      'mutation { createClub(input: { title: "Мафія Київ", region: "Львів" }) { id } }',
      'host',
    );
    expect(code(dup)).toBe('CONFLICT');

    // Join request -> only admins see it -> approve -> make host
    const join = await gql(
      `mutation { joinClub(clubId: ${ids.club}) { id status role } }`,
      'host',
    );
    expect(join.data.joinClub).toMatchObject({
      status: 'PENDING',
      role: 'MEMBER',
    });
    const memberId = Number(join.data.joinClub.id);

    expect(
      code(
        await gql(
          `{ clubMembers(clubId: ${ids.club}, status: PENDING) { id } }`,
          'outsider',
        ),
      ),
    ).toBe('FORBIDDEN');
    const pending = await gql(
      `{ clubMembers(clubId: ${ids.club}, status: PENDING) { user { username } } }`,
      'founder',
    );
    expect(pending.data.clubMembers).toEqual([{ user: { username: 'host' } }]);

    expect(
      code(
        await gql(
          `mutation { approveClubMember(memberId: ${memberId}) { id } }`,
          'outsider',
        ),
      ),
    ).toBe('FORBIDDEN');
    await gql(
      `mutation { approveClubMember(memberId: ${memberId}) { id } }`,
      'founder',
    );
    const promoted = await gql(
      `mutation { setClubMemberRole(memberId: ${memberId}, role: HOST) { role status } }`,
      'founder',
    );
    expect(promoted.data.setClubMemberRole).toEqual({
      role: 'HOST',
      status: 'ACTIVE',
    });

    const members = await gql(
      `{ clubMembers(clubId: ${ids.club}) { role user { username } } }`,
      null,
    );
    expect(members.data.clubMembers).toEqual([
      { role: 'ADMIN', user: { username: 'founder' } },
      { role: 'HOST', user: { username: 'host' } },
    ]);

    // The last admin cannot step down
    const founderMember = (await gql('{ myClubs { id } }', 'founder')).data
      .myClubs[0].id;
    const stepDown = await gql(
      `mutation { setClubMemberRole(memberId: ${founderMember}, role: MEMBER) { id } }`,
      'founder',
    );
    expect(message(stepDown)).toMatch(/at least one admin/);
  });

  it('lets only club hosts run club games', async () => {
    const outsider = await gql(
      `mutation { createGame(data: { gameTypeId: 1, clubId: ${ids.club}, startDate: "2030-01-01T19:00:00.000Z" }) { id } }`,
      'outsider',
    );
    expect(code(outsider)).toBe('FORBIDDEN');

    // A club host is not a platform host: no club-less games
    const noClub = await gql(
      'mutation { createGame(data: { gameTypeId: 1, startDate: "2030-01-01T19:00:00.000Z" }) { id } }',
      'host',
    );
    expect(code(noClub)).toBe('FORBIDDEN');

    const game = await gql(
      `mutation { createGame(data: { gameTypeId: 1, clubId: ${ids.club}, startDate: "2030-01-01T19:00:00.000Z" }) { id club { title } } }`,
      'host',
    );
    expect(game.data.createGame.club.title).toBe('Мафія Київ');
    ids.game = Number(game.data.createGame.id);

    expect(
      code(
        await gql(
          `mutation { addPlayerToGame(gameId: ${ids.game}, input: { userId: ${playerIds[0]} }) { id } }`,
          'outsider',
        ),
      ),
    ).toBe('FORBIDDEN');
  });

  it('applies the club rating rules and recalculates them on change', async () => {
    const P = await startGame(ids.game);
    const finished = await townWinsByFouls(ids.game, P);
    expect(finished.winnerTeam).toBe('TOWN');
    expect(pointsBySeat(finished.players)).toMatchObject({ 1: 1, 7: 1, 8: 0 });

    await gql(
      `mutation { awardBonus(gameId: ${ids.game}, input: { playerId: ${P[1]}, points: 0.5 }) { id } }`,
      'host',
    );

    const rules =
      'townWinPoints: 0.5, mafiaWinPoints: 2, neutralWinPoints: 2, lossPoints: -1, bonusEnabled: true, minGames: 0';
    expect(
      code(
        await gql(
          `mutation { updateRatingRules(clubId: ${ids.club}, rules: { ${rules} }) { id } }`,
          'host',
        ),
      ),
    ).toBe('FORBIDDEN');
    await gql(
      `mutation { updateRatingRules(clubId: ${ids.club}, rules: { ${rules} }) { id } }`,
      'founder',
    );

    let game = (
      await gql(
        `{ game(id: ${ids.game}) { players { seatNumber points bonus } } }`,
        null,
      )
    ).data.game;
    // town win 0.5 (+0.5 bonus for seat 1), mafia loss -1
    expect(pointsBySeat(game.players)).toMatchObject({ 1: 1, 2: 0.5, 8: -1 });

    await gql(
      `mutation { updateRatingRules(clubId: ${ids.club}, rules: { ${rules.replace('bonusEnabled: true', 'bonusEnabled: false')} }) { id } }`,
      'founder',
    );
    game = (
      await gql(
        `{ game(id: ${ids.game}) { players { seatNumber points } } }`,
        null,
      )
    ).data.game;
    expect(pointsBySeat(game.players)).toMatchObject({ 1: 0.5, 2: 0.5 });

    // Club rating respects the minimum number of games
    const clubRating = await gql(
      `{ rating(clubId: ${ids.club}) { user { username } points } }`,
      null,
    );
    expect(clubRating.data.rating).toHaveLength(10);
    await gql(
      `mutation { updateRatingRules(clubId: ${ids.club}, rules: { ${rules.replace('minGames: 0', 'minGames: 2')} }) { id } }`,
      'founder',
    );
    expect(
      (await gql(`{ rating(clubId: ${ids.club}) { points } }`, null)).data
        .rating,
    ).toEqual([]);
  });

  it('runs a tournament: participants only, table is the sum of its games', async () => {
    const created = await gql(
      `mutation { createTournament(input: { clubId: ${ids.club}, name: "Осінній кубок", startDate: "2030-02-01T10:00:00.000Z" }) { id status } }`,
      'host',
    );
    ids.tournament = Number(created.data.createTournament.id);
    expect(created.data.createTournament.status).toBe('PLANNED');

    const game = await gql(
      `mutation { createGame(data: { gameTypeId: 1, tournamentId: ${ids.tournament}, startDate: "2030-02-01T10:00:00.000Z" }) { id clubId tournamentId } }`,
      'host',
    );
    const gameId = Number(game.data.createGame.id);
    expect(game.data.createGame.clubId).toBe(ids.club);

    const notParticipant = await gql(
      `mutation { addPlayerToGame(gameId: ${gameId}, input: { userId: ${playerIds[0]} }) { id } }`,
      'host',
    );
    expect(message(notParticipant)).toMatch(/tournament participants/);

    for (const userId of playerIds) {
      await gql(
        `mutation { addTournamentParticipant(tournamentId: ${ids.tournament}, userId: ${userId}) { id } }`,
        'host',
      );
    }
    const P = await startGame(gameId);
    await townWinsByFouls(gameId, P);

    const table = await gql(
      `{ tournament(id: ${ids.tournament}) { participants { userId } games { id status } standings { place points games wins user { username } } } }`,
      null,
    );
    const t = table.data.tournament;
    expect(t.participants).toHaveLength(10);
    expect(t.games).toEqual([{ id: String(gameId), status: 'FINISHED' }]);
    expect(t.standings).toHaveLength(10);
    // Current club rules: town win 0.5, loss -1, no bonus
    expect(t.standings[0]).toMatchObject({
      place: 1,
      points: 0.5,
      games: 1,
      wins: 1,
    });
    expect(t.standings[9]).toMatchObject({ place: 10, points: -1, wins: 0 });

    expect(
      message(
        await gql(
          `mutation { deleteTournament(id: ${ids.tournament}) }`,
          'host',
        ),
      ),
    ).toMatch(/has games/);
  });
});
