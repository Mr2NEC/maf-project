import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { JwtUser } from 'src/auth/types/jwt-user';
import { UserRole } from 'src/enums/user-role.enum';

/** Global guard: enforces @Roles(...). Admins may do everything. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      UserRole[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const user = GqlExecutionContext.create(context).getContext<{
      req: { user?: JwtUser };
    }>().req.user;

    if (
      user &&
      (user.role === UserRole.ADMIN || requiredRoles.includes(user.role))
    ) {
      return true;
    }
    throw new ForbiddenException('Insufficient permissions');
  }
}
