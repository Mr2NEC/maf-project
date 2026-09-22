import { validateEnv } from './env.validation';

const validEnv = {
  NODE_ENV: 'development',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3307',
  MYSQL_USER: 'maf',
  MYSQL_PASSWORD: 'password',
  MYSQL_DATABASE: 'maf_project',
  JWT_SECRET: 'x'.repeat(32),
};

describe('validateEnv', () => {
  it('accepts a complete environment and converts types', () => {
    const env = validateEnv({ ...validEnv, BACKEND_PORT: '4000' });

    expect(env.MYSQL_PORT).toBe(3307);
    expect(env.BACKEND_PORT).toBe(4000);
    expect(env.JWT_EXPIRES_IN).toBe('15m');
  });

  it('parses boolean flags from strings', () => {
    const env = validateEnv({
      ...validEnv,
      GRAPHQL_PLAYGROUND: 'true',
      GRAPHQL_DEBUG: 'false',
    });

    expect(env.GRAPHQL_PLAYGROUND).toBe(true);
    expect(env.GRAPHQL_DEBUG).toBe(false);
  });

  it('keeps unsafe GraphQL features off by default', () => {
    const env = validateEnv(validEnv);

    expect(env.GRAPHQL_PLAYGROUND).toBe(false);
    expect(env.GRAPHQL_INTROSPECTION).toBe(false);
  });

  it('rejects a missing JWT secret instead of falling back to a default', () => {
    const { JWT_SECRET: _secret, ...env } = validEnv;

    expect(() => validateEnv(env)).toThrow(/JWT_SECRET/);
  });

  it('rejects a short JWT secret', () => {
    expect(() => validateEnv({ ...validEnv, JWT_SECRET: 'secret' })).toThrow(
      /at least 32 characters/,
    );
  });

  it('rejects a missing database password', () => {
    const { MYSQL_PASSWORD: _password, ...env } = validEnv;

    expect(() => validateEnv(env)).toThrow(/MYSQL_PASSWORD/);
  });

  it('rejects a malformed token lifetime', () => {
    expect(() =>
      validateEnv({ ...validEnv, JWT_EXPIRES_IN: '60 minutes' }),
    ).toThrow(/JWT_EXPIRES_IN/);
  });
});
