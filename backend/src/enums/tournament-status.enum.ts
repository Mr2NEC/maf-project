import { registerEnumType } from '@nestjs/graphql';

export enum TournamentStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

registerEnumType(TournamentStatus, { name: 'TournamentStatus' });
