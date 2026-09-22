import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtUser } from '../types/jwt-user';

/** The authenticated user, or undefined on a public resolver without a token. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser | undefined => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const req = gqlContext.getContext<{ req: Request }>().req;
    return req.user as JwtUser | undefined;
  },
);
