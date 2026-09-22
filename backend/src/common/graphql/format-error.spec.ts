import { ThrottlerException } from '@nestjs/throttler';
import { GraphQLError } from 'graphql';
import { formatGraphQLError } from './format-error';

describe('formatGraphQLError', () => {
  it('keeps the message and code of client errors', () => {
    const result = formatGraphQLError(
      {
        message: 'Game not found',
        path: ['game'],
        extensions: { code: 'NOT_FOUND' },
      },
      false,
    );

    expect(result).toEqual({
      message: 'Game not found',
      path: ['game'],
      extensions: { code: 'NOT_FOUND' },
    });
  });

  it.each([
    [404, 'NOT_FOUND'],
    [409, 'CONFLICT'],
    [429, 'TOO_MANY_REQUESTS'],
  ])('maps HTTP status %i passed through by Nest to %s', (status, code) => {
    const result = formatGraphQLError(
      {
        message: 'Client error',
        extensions: { code: 'INTERNAL_SERVER_ERROR', status },
      },
      false,
    );

    expect(result.message).toBe('Client error');
    expect(result.extensions?.code).toBe(code);
  });

  it('reads the status from an HttpException that Nest did not map', () => {
    const throttled = new GraphQLError('Too Many Requests', {
      path: ['signIn'],
      originalError: new ThrottlerException(),
    });

    const result = formatGraphQLError(
      {
        message: 'ThrottlerException: Too Many Requests',
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      },
      false,
      throttled,
    );

    expect(result.extensions?.code).toBe('TOO_MANY_REQUESTS');
    expect(result.message).toBe('ThrottlerException: Too Many Requests');
  });

  it('hides internals of unexpected errors', () => {
    const result = formatGraphQLError(
      {
        message: "ER_NO_SUCH_TABLE: Table 'maf.games' doesn't exist",
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          stacktrace: ['at Query.run'],
        },
      },
      false,
    );

    expect(result.message).toBe('Internal server error');
    expect(result.extensions).toEqual({ code: 'INTERNAL_SERVER_ERROR' });
  });

  it('treats errors without a code as internal', () => {
    const result = formatGraphQLError({ message: 'boom' }, false);

    expect(result.extensions?.code).toBe('INTERNAL_SERVER_ERROR');
    expect(result.message).toBe('Internal server error');
  });

  it('exposes validation messages as details', () => {
    const result = formatGraphQLError(
      {
        message: 'Bad Request Exception',
        extensions: {
          code: 'BAD_REQUEST',
          originalError: { message: ['email must be an email'] },
        },
      },
      false,
    );

    expect(result.extensions).toEqual({
      code: 'BAD_REQUEST',
      details: ['email must be an email'],
    });
  });

  it('shows the real message and stack trace in debug mode', () => {
    const result = formatGraphQLError(
      {
        message: 'boom',
        extensions: { code: 'INTERNAL_SERVER_ERROR', stacktrace: ['at x'] },
      },
      true,
    );

    expect(result.message).toBe('boom');
    expect(result.extensions?.stacktrace).toEqual(['at x']);
  });
});
