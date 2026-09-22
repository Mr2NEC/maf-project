import { registerEnumType } from '@nestjs/graphql';

/** A user's role inside one club. Ordered: each role includes the ones before it. */
export enum ClubRole {
  MEMBER = 'member',
  /** Runs the club's games and tournaments */
  HOST = 'host',
  /** Manages members, rating rules and the club profile */
  ADMIN = 'admin',
}

export const CLUB_ROLE_RANK: Record<ClubRole, number> = {
  [ClubRole.MEMBER]: 0,
  [ClubRole.HOST]: 1,
  [ClubRole.ADMIN]: 2,
};

registerEnumType(ClubRole, { name: 'ClubRole' });
