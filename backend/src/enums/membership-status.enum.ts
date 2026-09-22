import { registerEnumType } from '@nestjs/graphql';

export enum MembershipStatus {
  /** Asked to join, waiting for a club admin */
  PENDING = 'pending',
  ACTIVE = 'active',
}

registerEnumType(MembershipStatus, { name: 'MembershipStatus' });
