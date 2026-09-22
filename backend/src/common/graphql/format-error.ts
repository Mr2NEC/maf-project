import { GraphQLFormattedError } from 'graphql';

/** Codes that are safe to show to clients as-is. */
const CLIENT_ERROR_CODES = new Set([
  'BAD_REQUEST',
  'BAD_USER_INPUT',
  'GRAPHQL_PARSE_FAILED',
  'GRAPHQL_VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'TOO_MANY_REQUESTS',
]);

/**
 * @nestjs/apollo maps only 400/401/403/422 to codes; other HttpExceptions arrive
 * as INTERNAL_SERVER_ERROR with `status`, so we map the common ones here.
 */
const CODE_BY_HTTP_STATUS: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'BAD_USER_INPUT',
  429: 'TOO_MANY_REQUESTS',
};

type ErrorExtensions = {
  code?: string;
  status?: number;
  originalError?: { message?: string | string[] };
  stacktrace?: string[];
};

function resolveCode({ code, status }: ErrorExtensions): string {
  if (status !== undefined) {
    return (
      CODE_BY_HTTP_STATUS[status] ??
      (status < 500 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR')
    );
  }
  return code ?? 'INTERNAL_SERVER_ERROR';
}

/**
 * Stable error shape for clients: { message, path, extensions: { code, details? } }.
 * Unexpected errors are reported as INTERNAL_SERVER_ERROR without internals,
 * unless `debug` is on.
 */
export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  debug: boolean,
): GraphQLFormattedError {
  const extensions = (formatted.extensions ?? {}) as ErrorExtensions;
  const code = resolveCode(extensions);
  const isClientError = CLIENT_ERROR_CODES.has(code);

  // class-validator errors arrive as a list of messages in originalError
  const validationMessages = extensions.originalError?.message;
  const details = Array.isArray(validationMessages)
    ? validationMessages
    : undefined;

  return {
    message:
      isClientError || debug ? formatted.message : 'Internal server error',
    path: formatted.path,
    extensions: {
      code: isClientError ? code : 'INTERNAL_SERVER_ERROR',
      ...(details && { details }),
      ...(debug && { stacktrace: extensions.stacktrace }),
    },
  };
}
