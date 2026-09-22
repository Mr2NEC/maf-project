import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

/** ThrottlerGuard that reads the request from the GraphQL context. */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    const ctx = GqlExecutionContext.create(context).getContext<{
      req: Request;
      res: Response;
    }>();
    return { req: ctx.req, res: ctx.req.res ?? ctx.res };
  }
}
