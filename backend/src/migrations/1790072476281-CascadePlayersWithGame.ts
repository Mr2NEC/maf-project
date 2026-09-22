import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadePlayersWithGame1790072476281 implements MigrationInterface {
  name = 'CascadePlayersWithGame1790072476281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`players\` DROP FOREIGN KEY \`FK_cef52931b331b4ec107a220fb5d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD CONSTRAINT \`FK_cef52931b331b4ec107a220fb5d\` FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`players\` DROP FOREIGN KEY \`FK_cef52931b331b4ec107a220fb5d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`players\` ADD CONSTRAINT \`FK_cef52931b331b4ec107a220fb5d\` FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
