import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { SignInInput } from './dto/signIn.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthPayload } from './entities/auth-payload';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { JwtUser } from './types/jwt-user';

const INVALID_CREDENTIALS = 'Invalid email or password';

@Injectable()
export class AuthService {
  /** Hash compared against when the email is unknown, so both paths take similar time. */
  private dummyHash?: Promise<string>;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(input: SignUpInput): Promise<User> {
    const email = input.email.toLowerCase();

    if (await this.usersService.existsByEmail(email)) {
      throw new ConflictException('Email is already registered');
    }

    return this.usersService.create({
      username: input.username,
      email,
      password: await hash(input.password),
    });
  }

  async validateCredentials({ email, password }: SignInInput): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(
      email.toLowerCase(),
    );

    if (!user?.password) {
      this.dummyHash ??= hash('dummy-password-for-timing');
      await verify(await this.dummyHash, password);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (!(await verify(user.password, password))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return user;
  }

  async login(user: User): Promise<AuthPayload> {
    const payload: AuthJwtPayload = { sub: { userId: user.id } };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userId: user.id,
      role: user.role,
      accessToken,
    };
  }

  async validateJwtUser(userId: number): Promise<JwtUser> {
    const user = await this.usersService.findAuthInfo(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user.id, role: user.role };
  }
}
