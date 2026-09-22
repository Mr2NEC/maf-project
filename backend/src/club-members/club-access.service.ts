import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JwtUser } from 'src/auth/types/jwt-user';
import { CLUB_ROLE_RANK, ClubRole } from 'src/enums/club-role.enum';
import { MembershipStatus } from 'src/enums/membership-status.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { ClubMember } from './entities/club-member.entity';

/**
 * Answers "may this user do X in this club?". Roles are ranked
 * (member < host < admin); platform admins may do everything.
 */
@Injectable()
export class ClubAccessService {
  constructor(
    @InjectRepository(ClubMember)
    private readonly members: Repository<ClubMember>,
  ) {}

  /** The user's active role in the club, or null if not an active member. */
  async roleOf(
    userId: number,
    clubId: number,
    manager?: EntityManager,
  ): Promise<ClubRole | null> {
    const repo = manager?.getRepository(ClubMember) ?? this.members;
    const member = await repo.findOne({
      where: { userId, clubId, status: MembershipStatus.ACTIVE },
      select: { id: true, role: true },
    });
    return member?.role ?? null;
  }

  async can(
    user: JwtUser,
    clubId: number,
    required: ClubRole,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    const role = await this.roleOf(user.userId, clubId, manager);
    return role !== null && CLUB_ROLE_RANK[role] >= CLUB_ROLE_RANK[required];
  }

  async assert(
    user: JwtUser,
    clubId: number,
    required: ClubRole,
    manager?: EntityManager,
  ): Promise<void> {
    if (!(await this.can(user, clubId, required, manager))) {
      throw new ForbiddenException(`This needs the club ${required} role`);
    }
  }

  /**
   * Who may run a game: club hosts for club games; platform hosts and admins
   * for games without a club (created before clubs existed).
   */
  async assertCanHost(
    user: JwtUser,
    clubId: number | null,
    manager?: EntityManager,
  ): Promise<void> {
    if (clubId !== null) {
      return this.assert(user, clubId, ClubRole.HOST, manager);
    }
    if (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only hosts can run games');
    }
  }
}
