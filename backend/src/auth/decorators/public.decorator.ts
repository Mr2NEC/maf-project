import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Opens a resolver to anonymous users. Everything else requires a valid JWT.
 * If a token is sent anyway, the user is still attached to the request.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
