import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtUser } from 'src/auth/types/jwt-user';
import { UserRole } from 'src/enums/user-role.enum';
import { RolesGuard } from './roles.guard';

function contextFor(user?: JwtUser): ExecutionContext {
  jest
    .spyOn(GqlExecutionContext, 'create')
    .mockReturnValue({ getContext: () => ({ req: { user } }) } as never);
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);

  function requireRoles(roles: UserRole[] | undefined) {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(roles);
  }

  afterEach(() => jest.restoreAllMocks());

  it('allows resolvers without @Roles', () => {
    requireRoles(undefined);

    expect(guard.canActivate(contextFor())).toBe(true);
  });

  it('allows a user with a required role', () => {
    requireRoles([UserRole.HOST]);

    expect(
      guard.canActivate(contextFor({ userId: 1, role: UserRole.HOST })),
    ).toBe(true);
  });

  it('always allows admins', () => {
    requireRoles([UserRole.HOST]);

    expect(
      guard.canActivate(contextFor({ userId: 1, role: UserRole.ADMIN })),
    ).toBe(true);
  });

  it('rejects a user without the required role', () => {
    requireRoles([UserRole.ADMIN]);

    expect(() =>
      guard.canActivate(contextFor({ userId: 1, role: UserRole.USER })),
    ).toThrow(ForbiddenException);
  });

  it('rejects an anonymous request', () => {
    requireRoles([UserRole.HOST]);

    expect(() => guard.canActivate(contextFor())).toThrow(ForbiddenException);
  });
});
