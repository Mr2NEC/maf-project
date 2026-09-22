import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { ClubRole } from 'src/enums/club-role.enum';
import { MembershipStatus } from 'src/enums/membership-status.enum';
import { ClubMembersService } from './club-members.service';
import { ClubMember } from './entities/club-member.entity';

@Resolver(() => ClubMember)
export class ClubMembersResolver {
  constructor(private readonly service: ClubMembersService) {}

  /** Active members are public; pending requests only for club admins. */
  @Public()
  @Query(() => [ClubMember])
  clubMembers(
    @CurrentUser() user: JwtUser | undefined,
    @Args('clubId', { type: () => Int }) clubId: number,
    @Args('status', {
      type: () => MembershipStatus,
      defaultValue: MembershipStatus.ACTIVE,
    })
    status: MembershipStatus,
  ) {
    return this.service.listFor(user, clubId, status);
  }

  /** The signed-in user's memberships and requests. */
  @Query(() => [ClubMember])
  myClubs(@CurrentUser() user: JwtUser) {
    return this.service.ofUser(user.userId);
  }

  @Mutation(() => ClubMember)
  joinClub(
    @CurrentUser() user: JwtUser,
    @Args('clubId', { type: () => Int }) clubId: number,
  ) {
    return this.service.join(user, clubId);
  }

  @Mutation(() => Boolean)
  leaveClub(
    @CurrentUser() user: JwtUser,
    @Args('clubId', { type: () => Int }) clubId: number,
  ) {
    return this.service.leave(user, clubId);
  }

  @Mutation(() => ClubMember)
  approveClubMember(
    @CurrentUser() user: JwtUser,
    @Args('memberId', { type: () => Int }) memberId: number,
  ) {
    return this.service.approve(user, memberId);
  }

  @Mutation(() => ClubMember)
  setClubMemberRole(
    @CurrentUser() user: JwtUser,
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('role', { type: () => ClubRole }) role: ClubRole,
  ) {
    return this.service.setRole(user, memberId, role);
  }

  /** Rejects a request or removes a member. */
  @Mutation(() => Boolean)
  removeClubMember(
    @CurrentUser() user: JwtUser,
    @Args('memberId', { type: () => Int }) memberId: number,
  ) {
    return this.service.remove(user, memberId);
  }
}
