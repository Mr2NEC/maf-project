import { registerEnumType } from '@nestjs/graphql';

export enum GamePhase {
  NIGHT = 'night',
  DAY = 'day',
}

registerEnumType(GamePhase, { name: 'GamePhase' });
