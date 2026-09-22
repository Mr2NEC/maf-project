import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

// Values are guaranteed by validateEnv (config/env.validation.ts)
export const jwtConfig = registerAs<JwtConfig>('jwt', () => ({
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
}));
