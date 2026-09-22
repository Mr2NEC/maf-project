import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';

/**
 * Global guard: every resolver requires a valid JWT unless marked with @Public().
 * On public resolvers a valid token is still used to identify the user.
 */
@Injectable()
export class GqlJwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.isPublic(context)) {
      return (await super.canActivate(context)) as boolean;
    }

    try {
      await super.canActivate(context);
    } catch {
      // Anonymous or invalid token on a public resolver: continue without a user
    }
    return true;
  }

  handleRequest<TUser = JwtUser>(
    err: unknown,
    user: TUser | false,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (user) {
      return user;
    }
    if (this.isPublic(context)) {
      return undefined as TUser;
    }
    throw err instanceof Error ? err : new UnauthorizedException();
  }

  private isPublic(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false
    );
  }
}
