import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClubsTournamentsRating1790097239674 implements MigrationInterface {
  name = 'ClubsTournamentsRating1790097239674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`club_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`club_id\` int NOT NULL, \`user_id\` int NOT NULL, \`role\` enum ('member', 'host', 'admin') NOT NULL DEFAULT 'member', \`status\` enum ('pending', 'active') NOT NULL DEFAULT 'pending', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UQ_club_members_club_user\` (\`club_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tournament_participants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tournament_id\` int NOT NULL, \`user_id\` int NOT NULL, UNIQUE INDEX \`UQ_tournament_participants\` (\`tournament_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tournaments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`club_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`startDate\` datetime NOT NULL, \`endDate\` datetime NULL, \`status\` enum ('planned', 'active', 'finished') NOT NULL DEFAULT 'planned', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`description\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`rating_town_win_points\` float NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`rating_mafia_win_points\` float NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`rating_neutral_win_points\` float NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`rating_loss_points\` float NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`rating_bonus_enabled\` tinyint NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD \`rating_min_games\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE \`games\` ADD \`club_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD \`tournament_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD \`bonus\` float NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD UNIQUE INDEX \`IDX_710ac1f2add0d919d9e3945e82\` (\`title\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` CHANGE \`imgSrc\` \`imgSrc\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`club_members\` ADD CONSTRAINT \`FK_eb8c3ab7481d80579c96f26aeef\` FOREIGN KEY (\`club_id\`) REFERENCES \`clubs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`club_members\` ADD CONSTRAINT \`FK_898da09d81b2b69882052c92c3e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tournament_participants\` ADD CONSTRAINT \`FK_90bb0f064cef8d2ae4aaad10687\` FOREIGN KEY (\`tournament_id\`) REFERENCES \`tournaments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tournament_participants\` ADD CONSTRAINT \`FK_8836b1441db3023bcbc52718ca7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tournaments\` ADD CONSTRAINT \`FK_284ced15f09286d580150efcbea\` FOREIGN KEY (\`club_id\`) REFERENCES \`clubs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD CONSTRAINT \`FK_1bdf780847bc5dd570c700a87b5\` FOREIGN KEY (\`club_id\`) REFERENCES \`clubs\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD CONSTRAINT \`FK_231e3bf4d40e033e03864137113\` FOREIGN KEY (\`tournament_id\`) REFERENCES \`tournaments\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // Data: points used to be "1 for a win + bonus"; split the bonus out
    await queryRunner.query(`
            UPDATE \`players\` p
            JOIN \`games\` g ON g.id = p.game_id AND g.status = 'finished'
            LEFT JOIN \`roles\` r ON r.id = p.role_id
            SET p.bonus = p.points - (CASE WHEN r.team = g.winnerTeam THEN 1 ELSE 0 END)`);

    // Data: the legacy single-club link becomes an active membership
    await queryRunner.query(`
            INSERT INTO \`club_members\` (\`club_id\`, \`user_id\`, \`role\`, \`status\`)
            SELECT u.club_id, u.id, 'member', 'active' FROM \`users\` u
            WHERE u.club_id IS NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_231e3bf4d40e033e03864137113\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_1bdf780847bc5dd570c700a87b5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tournaments\` DROP FOREIGN KEY \`FK_284ced15f09286d580150efcbea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tournament_participants\` DROP FOREIGN KEY \`FK_8836b1441db3023bcbc52718ca7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tournament_participants\` DROP FOREIGN KEY \`FK_90bb0f064cef8d2ae4aaad10687\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`club_members\` DROP FOREIGN KEY \`FK_898da09d81b2b69882052c92c3e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`club_members\` DROP FOREIGN KEY \`FK_eb8c3ab7481d80579c96f26aeef\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` CHANGE \`imgSrc\` \`imgSrc\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP INDEX \`IDX_710ac1f2add0d919d9e3945e82\``,
    );
    await queryRunner.query(`ALTER TABLE \`players\` DROP COLUMN \`bonus\``);
    await queryRunner.query(
      `ALTER TABLE \`games\` DROP COLUMN \`tournament_id\``,
    );
    await queryRunner.query(`ALTER TABLE \`games\` DROP COLUMN \`club_id\``);
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`rating_min_games\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`rating_bonus_enabled\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`rating_loss_points\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`rating_neutral_win_points\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`rating_mafia_win_points\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`rating_town_win_points\``,
    );
    await queryRunner.query(`ALTER TABLE \`clubs\` DROP COLUMN \`createdAt\``);
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(`DROP TABLE \`tournaments\``);
    await queryRunner.query(
      `DROP INDEX \`UQ_tournament_participants\` ON \`tournament_participants\``,
    );
    await queryRunner.query(`DROP TABLE \`tournament_participants\``);
    await queryRunner.query(
      `DROP INDEX \`UQ_club_members_club_user\` ON \`club_members\``,
    );
    await queryRunner.query(`DROP TABLE \`club_members\``);
  }
}
