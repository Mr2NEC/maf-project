import { registerEnumType } from '@nestjs/graphql';

/** Side a role plays for; decides who wins. */
export enum Team {
  TOWN = 'town',
  MAFIA = 'mafia',
  /** Plays alone, e.g. a maniac */
  NEUTRAL = 'neutral',
}

registerEnumType(Team, { name: 'Team' });
