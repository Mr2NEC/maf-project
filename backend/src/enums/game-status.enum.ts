import { registerEnumType } from '@nestjs/graphql';

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

registerEnumType(GameStatus, {
  name: 'GameStatus',
  description: 'The status of a game',
});
