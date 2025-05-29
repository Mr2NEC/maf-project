import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInInput } from './dto/signIn.input';
import { User } from 'src/users/entities/user.entity';
import { AuthPayload } from './entities/auth-payload';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { JwtUser } from './types/jwt-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(input: CreateUserInput) {
    const hashedPassword = await hash(input.password);
    return this.usersService.create({
      ...input,
      password: hashedPassword,
    });
  }

  async validateLocalUser(input: SignInInput) {
    const { email, password } = input;
    const user = await this.usersService.findOneBy({ email });

    const passwordMatched = await verify(user.password, password);

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = {
      sub: {
        userId,
      },
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async login(user: User): Promise<AuthPayload> {
    const { accessToken } = await this.generateToken(user.id);

    return {
      userId: user.id,
      role: user.role,
      accessToken,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.usersService.findOneBy({ id: userId });
    const jwtUser: JwtUser = {
      userId: user.id,
      role: user.role,
    };
    return jwtUser;
  }
}
