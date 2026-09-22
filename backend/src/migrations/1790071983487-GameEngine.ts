import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameEngine1790071983487 implements MigrationInterface {
  name = 'GameEngine1790071983487';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`action_types\` ADD \`effect\` enum ('kill', 'heal', 'check', 'block', 'vote', 'note') NOT NULL DEFAULT 'note'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_types\` ADD \`phase\` enum ('night', 'day') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` ADD \`phase\` enum ('night', 'day') NOT NULL DEFAULT 'night'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`team\` enum ('town', 'mafia', 'neutral') NOT NULL DEFAULT 'town'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_types\` ADD \`maxFouls\` int NOT NULL DEFAULT '4'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD \`phase\` enum ('night', 'day') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD \`winnerTeam\` enum ('town', 'mafia', 'neutral') NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD \`finishedAt\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD \`status\` enum ('alive', 'killed', 'voted_out', 'disqualified') NOT NULL DEFAULT 'alive'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD \`eliminatedRound\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD \`fouls\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD \`points\` float NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` CHANGE \`status\` \`status\` enum ('waiting', 'in_progress', 'finished', 'cancelled') NOT NULL DEFAULT 'waiting'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`UQ_players_game_user\` ON \`players\` (\`game_id\`, \`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`UQ_players_game_seat\` ON \`players\` (\`game_id\`, \`seatNumber\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`UQ_players_game_seat\` ON \`players\``,
    );
    await queryRunner.query(
      `DROP INDEX \`UQ_players_game_user\` ON \`players\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` CHANGE \`status\` \`status\` enum ('waiting', 'in_progress', 'finished') NOT NULL DEFAULT 'waiting'`,
    );
    await queryRunner.query(`ALTER TABLE \`players\` DROP COLUMN \`points\``);
    await queryRunner.query(`ALTER TABLE \`players\` DROP COLUMN \`fouls\``);
    await queryRunner.query(
      `ALTER TABLE \`players\` DROP COLUMN \`eliminatedRound\``,
    );
    await queryRunner.query(`ALTER TABLE \`players\` DROP COLUMN \`status\``);
    await queryRunner.query(`ALTER TABLE \`games\` DROP COLUMN \`finishedAt\``);
    await queryRunner.query(`ALTER TABLE \`games\` DROP COLUMN \`winnerTeam\``);
    await queryRunner.query(`ALTER TABLE \`games\` DROP COLUMN \`phase\``);
    await queryRunner.query(
      `ALTER TABLE \`game_types\` DROP COLUMN \`maxFouls\``,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`team\``);
    await queryRunner.query(`ALTER TABLE \`actions\` DROP COLUMN \`phase\``);
    await queryRunner.query(
      `ALTER TABLE \`action_types\` DROP COLUMN \`phase\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_types\` DROP COLUMN \`effect\``,
    );
  }
}
