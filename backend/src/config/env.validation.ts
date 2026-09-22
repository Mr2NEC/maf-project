import 'reflect-metadata';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

const toBoolean = ({ value }: { value: unknown }) =>
  value === true || value === 'true';

export class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  BACKEND_PORT: number = 4000;

  @IsString()
  @IsNotEmpty()
  MYSQL_HOST: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  MYSQL_PORT: number = 3306;

  @IsString()
  @IsNotEmpty()
  MYSQL_USER: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_DATABASE: string;

  @IsString()
  @MinLength(32, { message: 'JWT_SECRET must be at least 32 characters' })
  JWT_SECRET: string;

  @Matches(/^\d+[smhd]$/, {
    message: 'JWT_EXPIRES_IN must look like 15m, 1h or 7d',
  })
  JWT_EXPIRES_IN: string = '15m';

  @Transform(toBoolean)
  @IsBoolean()
  GRAPHQL_PLAYGROUND: boolean = false;

  @Transform(toBoolean)
  @IsBoolean()
  GRAPHQL_DEBUG: boolean = false;

  @Transform(toBoolean)
  @IsBoolean()
  GRAPHQL_INTROSPECTION: boolean = false;

  @Transform(toBoolean)
  @IsBoolean()
  GRAPHQL_SORT_SCHEMA: boolean = true;

  @IsString()
  GRAPHQL_PATH: string = '/graphql';

  @IsString()
  GRAPHQL_SCHEMA_PATH: string = 'src/schema.gql';

  @Transform(toBoolean)
  @IsBoolean()
  GRAPHQL_CORS: boolean = false;

  /**
   * Express "trust proxy" setting, e.g. "uniquelocal" when the Next.js server
   * (which forwards the visitor IP) runs in the same private network.
   * Leave empty when the API is reachable directly from the internet.
   */
  @IsOptional()
  @IsString()
  TRUST_PROXY?: string;
}

/**
 * Fails fast on startup when the environment is incomplete or unsafe,
 * instead of silently falling back to insecure defaults.
 */
export function validateEnv(config: Record<string, unknown>) {
  // No implicit conversion: it would turn the string "false" into true
  const validated = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .flatMap(error => Object.values(error.constraints ?? {}))
      .join('\n  - ');
    throw new Error(`Invalid environment configuration:\n  - ${details}`);
  }

  return validated;
}
