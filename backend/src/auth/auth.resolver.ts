import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInInput } from './dto/signIn.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthPayload } from './entities/auth-payload';

// Brute-force protection: at most 5 attempts per minute per IP
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@Public()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Throttle(AUTH_THROTTLE)
  @Mutation(() => User)
  signup(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Throttle(AUTH_THROTTLE)
  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInInput) {
    const user = await this.authService.validateCredentials(input);
    return this.authService.login(user);
  }
}
