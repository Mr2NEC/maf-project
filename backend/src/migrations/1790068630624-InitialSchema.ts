import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1790068630624 implements MigrationInterface {
  name = 'InitialSchema1790068630624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`club-owners\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`link\` varchar(255) NULL, UNIQUE INDEX \`IDX_fbbfe45f5c8b561106789e0ed4\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`places\` (\`id\` int NOT NULL AUTO_INCREMENT, \`country\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`action_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5a6eb003ce7d2da465fd78cd40\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`action_targets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`action_id\` int NOT NULL, \`target_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`actions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`game_id\` int NOT NULL, \`actor_id\` int NOT NULL, \`action_type_id\` int NOT NULL, \`round\` int NOT NULL, \`order\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_actions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role_id\` int NOT NULL, \`action_type_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game_type_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`game_type_id\` int NOT NULL, \`role_id\` int NOT NULL, \`count\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`playersCount\` int NOT NULL, UNIQUE INDEX \`IDX_a6d33319ca54baf9079d14be48\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`games\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('waiting', 'in_progress', 'finished') NOT NULL DEFAULT 'waiting', \`currentRound\` int NOT NULL DEFAULT '0', \`game_type_id\` int NOT NULL, \`startDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`players\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`seatNumber\` int NULL, \`role_id\` int NULL, \`user_id\` int NOT NULL, \`game_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`birthdate\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('user', 'host', 'admin') NOT NULL DEFAULT 'user', \`password\` varchar(255) NULL, \`profile_id\` int NULL, \`club_id\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`REL_23371445bd80cb3e413089551b\` (\`profile_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`clubs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`imgSrc\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`region\` varchar(255) NOT NULL, \`ownerId\` int NULL, \`placeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`socials\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`link\` varchar(255) NOT NULL, \`club_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_targets\` ADD CONSTRAINT \`FK_4138e1c1dd4434edaac0e0ac668\` FOREIGN KEY (\`action_id\`) REFERENCES \`actions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_targets\` ADD CONSTRAINT \`FK_9b5bd16dad64bc2ee2235cee5d6\` FOREIGN KEY (\`target_id\`) REFERENCES \`players\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` ADD CONSTRAINT \`FK_1b9460b5f6b49fa82a322891ac0\` FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` ADD CONSTRAINT \`FK_56847dec03fa31bf68ac561ec06\` FOREIGN KEY (\`actor_id\`) REFERENCES \`players\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` ADD CONSTRAINT \`FK_b409ef7c503c9a88eca262a4e12\` FOREIGN KEY (\`action_type_id\`) REFERENCES \`action_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_actions\` ADD CONSTRAINT \`FK_2ed4344d4ad234b70b11e3014ed\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_actions\` ADD CONSTRAINT \`FK_d3c4e34f86de781a703ea2dbff2\` FOREIGN KEY (\`action_type_id\`) REFERENCES \`action_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_type_roles\` ADD CONSTRAINT \`FK_fec0987e52f66476dcc8a097e53\` FOREIGN KEY (\`game_type_id\`) REFERENCES \`game_types\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_type_roles\` ADD CONSTRAINT \`FK_b863d8ca560e8951d7584ba316b\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD CONSTRAINT \`FK_1bd6bd517280e96a8bf3048439b\` FOREIGN KEY (\`game_type_id\`) REFERENCES \`game_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD CONSTRAINT \`FK_0588cd60ba5c4f973f50a3265fb\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD CONSTRAINT \`FK_ba3575d2fbe71fab7155366235e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD CONSTRAINT \`FK_cef52931b331b4ec107a220fb5d\` FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_23371445bd80cb3e413089551bf\` FOREIGN KEY (\`profile_id\`) REFERENCES \`profiles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_e58379384536c965ebebefb12a3\` FOREIGN KEY (\`club_id\`) REFERENCES \`clubs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD CONSTRAINT \`FK_442b2d230da2dd49b2b4bc075dd\` FOREIGN KEY (\`ownerId\`) REFERENCES \`club-owners\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` ADD CONSTRAINT \`FK_9724ec1126e8574329bf4a51734\` FOREIGN KEY (\`placeId\`) REFERENCES \`places\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`socials\` ADD CONSTRAINT \`FK_a0aa3946c226689326eb672b51d\` FOREIGN KEY (\`club_id\`) REFERENCES \`clubs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`socials\` ADD CONSTRAINT \`FK_29083db218aae74c09bb92f939a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`socials\` DROP FOREIGN KEY \`FK_29083db218aae74c09bb92f939a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`socials\` DROP FOREIGN KEY \`FK_a0aa3946c226689326eb672b51d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP FOREIGN KEY \`FK_9724ec1126e8574329bf4a51734\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clubs\` DROP FOREIGN KEY \`FK_442b2d230da2dd49b2b4bc075dd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_e58379384536c965ebebefb12a3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_23371445bd80cb3e413089551bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` DROP FOREIGN KEY \`FK_cef52931b331b4ec107a220fb5d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` DROP FOREIGN KEY \`FK_ba3575d2fbe71fab7155366235e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` DROP FOREIGN KEY \`FK_0588cd60ba5c4f973f50a3265fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_1bd6bd517280e96a8bf3048439b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_type_roles\` DROP FOREIGN KEY \`FK_b863d8ca560e8951d7584ba316b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game_type_roles\` DROP FOREIGN KEY \`FK_fec0987e52f66476dcc8a097e53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_actions\` DROP FOREIGN KEY \`FK_d3c4e34f86de781a703ea2dbff2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_actions\` DROP FOREIGN KEY \`FK_2ed4344d4ad234b70b11e3014ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` DROP FOREIGN KEY \`FK_b409ef7c503c9a88eca262a4e12\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` DROP FOREIGN KEY \`FK_56847dec03fa31bf68ac561ec06\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`actions\` DROP FOREIGN KEY \`FK_1b9460b5f6b49fa82a322891ac0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_targets\` DROP FOREIGN KEY \`FK_9b5bd16dad64bc2ee2235cee5d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`action_targets\` DROP FOREIGN KEY \`FK_4138e1c1dd4434edaac0e0ac668\``,
    );
    await queryRunner.query(`DROP TABLE \`socials\``);
    await queryRunner.query(`DROP TABLE \`clubs\``);
    await queryRunner.query(
      `DROP INDEX \`REL_23371445bd80cb3e413089551b\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`profiles\``);
    await queryRunner.query(`DROP TABLE \`players\``);
    await queryRunner.query(`DROP TABLE \`games\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a6d33319ca54baf9079d14be48\` ON \`game_types\``,
    );
    await queryRunner.query(`DROP TABLE \`game_types\``);
    await queryRunner.query(`DROP TABLE \`game_type_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`role_actions\``);
    await queryRunner.query(`DROP TABLE \`actions\``);
    await queryRunner.query(`DROP TABLE \`action_targets\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_5a6eb003ce7d2da465fd78cd40\` ON \`action_types\``,
    );
    await queryRunner.query(`DROP TABLE \`action_types\``);
    await queryRunner.query(`DROP TABLE \`places\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fbbfe45f5c8b561106789e0ed4\` ON \`club-owners\``,
    );
    await queryRunner.query(`DROP TABLE \`club-owners\``);
  }
}
