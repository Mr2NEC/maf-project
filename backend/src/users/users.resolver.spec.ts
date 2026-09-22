import { ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/enums/user-role.enum';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  const usersService = { update: jest.fn() };
  const resolver = new UsersResolver(usersService as unknown as UsersService);
  const owner = { userId: 1, role: UserRole.USER };
  const stranger = { userId: 2, role: UserRole.USER };
  const admin = { userId: 3, role: UserRole.ADMIN };
  const user = { id: 1, email: 'don@mafia.ua' } as User;

  describe('updateUser', () => {
    it('lets users update themselves', () => {
      void resolver.update(owner, 1, { username: 'don' });

      expect(usersService.update).toHaveBeenCalledWith(1, { username: 'don' });
    });

    it('lets admins update anyone', () => {
      void resolver.update(admin, 1, { username: 'don' });

      expect(usersService.update).toHaveBeenCalledWith(1, { username: 'don' });
    });

    it('forbids updating another user', () => {
      expect(() => resolver.update(stranger, 1, { username: 'x' })).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('email field', () => {
    it('is visible to the owner', () => {
      expect(resolver.email(user, owner)).toBe('don@mafia.ua');
    });

    it('is visible to admins', () => {
      expect(resolver.email(user, admin)).toBe('don@mafia.ua');
    });

    it('is hidden from other users and anonymous visitors', () => {
      expect(resolver.email(user, stranger)).toBeNull();
      expect(resolver.email(user, undefined)).toBeNull();
    });
  });
});
