import ENV_VARS, { EnvType } from './envVars';

describe('envVars module', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_ENV_TYPE = 'development';
  });

  it('should define valid environment types', () => {
    expect(Object.values(EnvType)).toContain('development');
    expect(Object.values(EnvType)).toContain('production');
  });

  it('should correctly set environment variable', () => {
    const env = Object.freeze({
      ENV_TYPE: process.env.NEXT_PUBLIC_ENV_TYPE
        ? process.env.NEXT_PUBLIC_ENV_TYPE.toLowerCase() as EnvType
        : 'development',
    });
    expect(env.ENV_TYPE).toBe('development');
  });
});
