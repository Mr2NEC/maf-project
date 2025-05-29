import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthPayload } from './entities/auth-payload';
import { SignInInput } from './dto/signIn.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signup(@Args('input') input: CreateUserInput) {
    return this.authService.registerUser(input);
  }

  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInInput) {
    const user = await this.authService.validateLocalUser(input);
    return await this.authService.login(user);
  }
}
