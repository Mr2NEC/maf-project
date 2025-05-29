import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { JwtService } from '@nestjs/jwt';
import { SignInInput } from './dto/signIn.input';
import { User } from 'src/users/entities/user.entity';
import { AuthPayload } from './entities/auth-payload';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { JwtUser } from './types/jwt-user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(input: CreateUserInput) {
    const hashedPassword = await hash(input.password);
    const newUser = this.usersRepository.create({
      ...input,
      password: hashedPassword,
      role: UserRole.USER,
    });
    return await this.usersRepository.save(newUser);
  }

  async validateLocalUser(input: SignInInput) {
    const { email, password } = input;
    const user = await this.usersRepository.findOneByOrFail({ email });

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
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    const jwtUser: JwtUser = {
      userId: user.id,
      role: user.role,
    };
    return jwtUser;
  }
}
