import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { JwtUser } from 'src/auth/types/jwt-user';
import { Club } from 'src/clubs/entities/club.entity';
import { ClubRole } from 'src/enums/club-role.enum';
import { MembershipStatus } from 'src/enums/membership-status.enum';
import { ClubAccessService } from './club-access.service';
import { ClubMember } from './entities/club-member.entity';

@Injectable()
export class ClubMembersService {
  constructor(
    @InjectRepository(ClubMember)
    private readonly members: Repository<ClubMember>,
    @InjectRepository(Club) private readonly clubs: Repository<Club>,
    private readonly access: ClubAccessService,
  ) {}

  list(clubId: number, status: MembershipStatus): Promise<ClubMember[]> {
    return this.members.find({
      where: { clubId, status },
      relations: { user: true },
      order: { role: 'DESC', createdAt: 'ASC' },
    });
  }

  /** Pending requests are visible to club admins only. */
  async listFor(
    user: JwtUser | undefined,
    clubId: number,
    status: MembershipStatus,
  ): Promise<ClubMember[]> {
    if (status === MembershipStatus.PENDING) {
      if (!user || !(await this.access.can(user, clubId, ClubRole.ADMIN))) {
        throw new ForbiddenException('Only club admins see join requests');
      }
    }
    return this.list(clubId, status);
  }

  ofUser(userId: number): Promise<ClubMember[]> {
    return this.members.find({
      where: { userId },
      relations: { club: true },
      order: { createdAt: 'ASC' },
    });
  }

  async join(user: JwtUser, clubId: number): Promise<ClubMember> {
    if (!(await this.clubs.existsBy({ id: clubId }))) {
      throw new EntityNotFoundError(Club, { id: clubId });
    }
    if (await this.members.existsBy({ clubId, userId: user.userId })) {
      throw new ConflictException('You have already joined or asked to join');
    }
    const { identifiers } = await this.members.insert({
      clubId,
      userId: user.userId,
      role: ClubRole.MEMBER,
      status: MembershipStatus.PENDING,
    });
    return this.findOne((identifiers[0] as { id: number }).id);
  }

  async approve(user: JwtUser, memberId: number): Promise<ClubMember> {
    const member = await this.findOne(memberId);
    await this.access.assert(user, member.clubId, ClubRole.ADMIN);
    await this.members.update(memberId, { status: MembershipStatus.ACTIVE });
    return this.findOne(memberId);
  }

  async setRole(
    user: JwtUser,
    memberId: number,
    role: ClubRole,
  ): Promise<ClubMember> {
    const member = await this.findOne(memberId);
    await this.access.assert(user, member.clubId, ClubRole.ADMIN);
    if (member.status !== MembershipStatus.ACTIVE) {
      throw new BadRequestException('Approve the request before giving a role');
    }
    if (member.role === ClubRole.ADMIN && role !== ClubRole.ADMIN) {
      await this.assertNotLastAdmin(member.clubId);
    }
    await this.members.update(memberId, { role });
    return this.findOne(memberId);
  }

  /** Admins remove members or reject requests; anyone may leave on their own. */
  async remove(user: JwtUser, memberId: number): Promise<boolean> {
    const member = await this.findOne(memberId);
    if (member.userId !== user.userId) {
      await this.access.assert(user, member.clubId, ClubRole.ADMIN);
    }
    if (
      member.role === ClubRole.ADMIN &&
      member.status === MembershipStatus.ACTIVE
    ) {
      await this.assertNotLastAdmin(member.clubId);
    }
    await this.members.delete(memberId);
    return true;
  }

  async leave(user: JwtUser, clubId: number): Promise<boolean> {
    const member = await this.members.findOne({
      where: { clubId, userId: user.userId },
    });
    if (!member) {
      throw new EntityNotFoundError(ClubMember, { clubId });
    }
    return this.remove(user, member.id);
  }

  private async findOne(id: number): Promise<ClubMember> {
    const member = await this.members.findOne({
      where: { id },
      relations: { user: true, club: true },
    });
    if (!member) {
      throw new EntityNotFoundError(ClubMember, { id });
    }
    return member;
  }

  private async assertNotLastAdmin(clubId: number): Promise<void> {
    const admins = await this.members.countBy({
      clubId,
      role: ClubRole.ADMIN,
      status: MembershipStatus.ACTIVE,
    });
    if (admins <= 1) {
      throw new BadRequestException('A club needs at least one admin');
    }
  }
}
