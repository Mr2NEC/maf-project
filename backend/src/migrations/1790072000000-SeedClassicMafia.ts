import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Reference data for classic club mafia. Admins can change or extend it;
 * the engine only relies on the effects, not on the names.
 * The VOTE action type is required: the engine records day votes with it.
 */
const ACTION_TYPES = [
  { name: 'Постріл', effect: 'kill', phase: 'night' },
  { name: 'Лікування', effect: 'heal', phase: 'night' },
  { name: 'Перевірка', effect: 'check', phase: 'night' },
  { name: 'Блокування', effect: 'block', phase: 'night' },
  { name: 'Голосування', effect: 'vote', phase: 'day' },
];

const ROLES = [
  { name: 'Мирний', team: 'town', actions: [] },
  { name: 'Комісар', team: 'town', actions: ['Перевірка'] },
  { name: 'Лікар', team: 'town', actions: ['Лікування'] },
  { name: 'Путана', team: 'town', actions: ['Блокування'] },
  { name: 'Мафія', team: 'mafia', actions: ['Постріл'] },
  { name: 'Маніяк', team: 'neutral', actions: ['Постріл'] },
];

const GAME_TYPES = [
  {
    name: 'Класична (10 гравців)',
    description: '5 мирних, комісар, лікар, 3 мафії',
    roles: { Мирний: 5, Комісар: 1, Лікар: 1, Мафія: 3 },
  },
  {
    name: 'Розширена (12 гравців)',
    description: '5 мирних, комісар, лікар, путана, 3 мафії, маніяк',
    roles: { Мирний: 5, Комісар: 1, Лікар: 1, Путана: 1, Мафія: 3, Маніяк: 1 },
  },
];

export class SeedClassicMafia1790072000000 implements MigrationInterface {
  name = 'SeedClassicMafia1790072000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { name, effect, phase } of ACTION_TYPES) {
      await queryRunner.query(
        'INSERT IGNORE INTO `action_types` (`name`, `effect`, `phase`) VALUES (?, ?, ?)',
        [name, effect, phase],
      );
    }

    for (const { name, team, actions } of ROLES) {
      await queryRunner.query(
        'INSERT IGNORE INTO `roles` (`name`, `team`) VALUES (?, ?)',
        [name, team],
      );
      for (const action of actions) {
        await queryRunner.query(
          `INSERT INTO \`role_actions\` (\`role_id\`, \`action_type_id\`)
           SELECT r.id, a.id FROM \`roles\` r, \`action_types\` a
           WHERE r.name = ? AND a.name = ?
             AND NOT EXISTS (
               SELECT 1 FROM \`role_actions\` ra
               WHERE ra.role_id = r.id AND ra.action_type_id = a.id
             )`,
          [name, action],
        );
      }
    }

    for (const { name, description, roles } of GAME_TYPES) {
      const playersCount = Object.values(roles).reduce((a, b) => a + b, 0);
      await queryRunner.query(
        'INSERT IGNORE INTO `game_types` (`name`, `description`, `playersCount`) VALUES (?, ?, ?)',
        [name, description, playersCount],
      );
      for (const [role, count] of Object.entries(roles)) {
        await queryRunner.query(
          `INSERT INTO \`game_type_roles\` (\`game_type_id\`, \`role_id\`, \`count\`)
           SELECT g.id, r.id, ? FROM \`game_types\` g, \`roles\` r
           WHERE g.name = ? AND r.name = ?
             AND NOT EXISTS (
               SELECT 1 FROM \`game_type_roles\` x
               WHERE x.game_type_id = g.id AND x.role_id = r.id
             )`,
          [count, name, role],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only removes seeded rows that no game uses
    for (const { name } of GAME_TYPES) {
      await queryRunner.query(
        `DELETE FROM \`game_types\` WHERE name = ?
         AND id NOT IN (SELECT game_type_id FROM \`games\`)`,
        [name],
      );
    }
    for (const { name } of ROLES) {
      await queryRunner.query(
        `DELETE FROM \`roles\` WHERE name = ?
         AND id NOT IN (SELECT role_id FROM \`players\` WHERE role_id IS NOT NULL)`,
        [name],
      );
    }
    for (const { name } of ACTION_TYPES) {
      await queryRunner.query(
        `DELETE FROM \`action_types\` WHERE name = ?
         AND id NOT IN (SELECT action_type_id FROM \`actions\`)`,
        [name],
      );
    }
  }
}
