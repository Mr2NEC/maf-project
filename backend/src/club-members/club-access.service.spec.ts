import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClubRole } from 'src/enums/club-role.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { ClubAccessService } from './club-access.service';
import { ClubMember } from './entities/club-member.entity';

describe('ClubAccessService', () => {
  const members = { findOne: jest.fn() };
  const access = new ClubAccessService(
    members as unknown as Repository<ClubMember>,
  );
  const user = { userId: 1, role: UserRole.USER };

  const memberWithRole = (role: ClubRole | null) =>
    members.findOne.mockResolvedValue(role ? { id: 1, role } : null);

  it('ranks roles: admin can do what a host can, a host what a member can', async () => {
    memberWithRole(ClubRole.ADMIN);
    await expect(access.can(user, 3, ClubRole.HOST)).resolves.toBe(true);

    memberWithRole(ClubRole.HOST);
    await expect(access.can(user, 3, ClubRole.MEMBER)).resolves.toBe(true);
    await expect(access.can(user, 3, ClubRole.ADMIN)).resolves.toBe(false);
  });

  it('refuses users who are not active members', async () => {
    memberWithRole(null);

    await expect(access.can(user, 3, ClubRole.MEMBER)).resolves.toBe(false);
    await expect(access.assert(user, 3, ClubRole.MEMBER)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('lets platform admins do everything without a membership', async () => {
    memberWithRole(null);

    await expect(
      access.can({ userId: 2, role: UserRole.ADMIN }, 3, ClubRole.ADMIN),
    ).resolves.toBe(true);
  });

  it('requires club hosts for club games and platform hosts for club-less games', async () => {
    memberWithRole(ClubRole.MEMBER);
    await expect(access.assertCanHost(user, 3)).rejects.toThrow(
      ForbiddenException,
    );

    memberWithRole(ClubRole.HOST);
    await expect(access.assertCanHost(user, 3)).resolves.toBeUndefined();

    await expect(access.assertCanHost(user, null)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(
      access.assertCanHost({ userId: 1, role: UserRole.HOST }, null),
    ).resolves.toBeUndefined();
  });
});
