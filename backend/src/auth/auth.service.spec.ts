import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { UserRole } from 'src/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let usersService: jest.Mocked<
    Pick<
      UsersService,
      'existsByEmail' | 'create' | 'findByEmailWithPassword' | 'findAuthInfo'
    >
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let service: AuthService;

  beforeEach(() => {
    usersService = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmailWithPassword: jest.fn(),
      findAuthInfo: jest.fn(),
    };
    jwtService = { signAsync: jest.fn().mockResolvedValue('token') };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  describe('signUp', () => {
    it('stores a normalized email and a hashed password', async () => {
      usersService.existsByEmail.mockResolvedValue(false);
      usersService.create.mockImplementation(input =>
        Promise.resolve({ id: 1, ...input } as User),
      );

      await service.signUp({
        username: 'don',
        email: 'Don@Mafia.UA',
        password: 'correct-horse',
      });

      const created = usersService.create.mock.calls[0][0];
      expect(created.email).toBe('don@mafia.ua');
      expect(created.password).not.toBe('correct-horse');
      expect(created.password).toMatch(/^\$argon2/);
    });

    it('rejects an email that is already registered', async () => {
      usersService.existsByEmail.mockResolvedValue(true);

      await expect(
        service.signUp({
          username: 'don',
          email: 'don@mafia.ua',
          password: 'correct-horse',
        }),
      ).rejects.toThrow(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('validateCredentials', () => {
    it('returns the user for a correct password', async () => {
      const user = { id: 1, password: await hash('correct-horse') } as User;
      usersService.findByEmailWithPassword.mockResolvedValue(user);

      await expect(
        service.validateCredentials({
          email: 'DON@mafia.ua',
          password: 'correct-horse',
        }),
      ).resolves.toBe(user);
      expect(usersService.findByEmailWithPassword).toHaveBeenCalledWith(
        'don@mafia.ua',
      );
    });

    it('gives the same error for an unknown email and a wrong password', async () => {
      usersService.findByEmailWithPassword.mockResolvedValueOnce(null);
      const unknownEmail = service
        .validateCredentials({ email: 'x@mafia.ua', password: 'whatever1' })
        .catch((error: Error) => error);

      usersService.findByEmailWithPassword.mockResolvedValueOnce({
        id: 1,
        password: await hash('correct-horse'),
      } as User);
      const wrongPassword = service
        .validateCredentials({ email: 'don@mafia.ua', password: 'wrong-pass' })
        .catch((error: Error) => error);

      const [first, second] = await Promise.all([unknownEmail, wrongPassword]);
      expect(first).toBeInstanceOf(UnauthorizedException);
      expect(second).toBeInstanceOf(UnauthorizedException);
      expect((first as Error).message).toBe((second as Error).message);
    });
  });

  describe('validateJwtUser', () => {
    it('rejects a token of a deleted user', async () => {
      usersService.findAuthInfo.mockResolvedValue(null);

      await expect(service.validateJwtUser(1)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns the current role from the database', async () => {
      usersService.findAuthInfo.mockResolvedValue({
        id: 1,
        role: UserRole.HOST,
      });

      await expect(service.validateJwtUser(1)).resolves.toEqual({
        userId: 1,
        role: UserRole.HOST,
      });
    });
  });
});
