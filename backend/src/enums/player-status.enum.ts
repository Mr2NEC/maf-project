import { registerEnumType } from '@nestjs/graphql';

export enum PlayerStatus {
  ALIVE = 'alive',
  /** Killed at night */
  KILLED = 'killed',
  /** Voted out during the day */
  VOTED_OUT = 'voted_out',
  /** Removed for fouls */
  DISQUALIFIED = 'disqualified',
}

registerEnumType(PlayerStatus, { name: 'PlayerStatus' });
