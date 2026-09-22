import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'user',
  /** Runs games: creates games and records actions */
  HOST = 'host',
  ADMIN = 'admin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'The role of a user',
});
