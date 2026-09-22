import { registerEnumType } from '@nestjs/graphql';

export enum GameStatus {
  /** Players register, get seats and roles */
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

registerEnumType(GameStatus, {
  name: 'GameStatus',
  description: 'The status of a game',
});
