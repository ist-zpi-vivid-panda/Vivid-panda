import ENV_VARS from '../envVars';

describe('envVars module', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_METHOD = 'GET';
    process.env.NEXT_PUBLIC_IP_ADDRESS = '127.0.0.1';
    process.env.NEXT_PUBLIC_BACKEND_PORT = '3000';
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'dummy-google-client-id';
  });

  it('should define environment variables correctly', () => {
    const ENV_VARS = require('../envVars').default;
    expect(ENV_VARS.METHOD).toBe('GET');
    expect(ENV_VARS.IP_ADDRESS).toBe('127.0.0.1');
    expect(ENV_VARS.BACKEND_PORT).toBe(3000);
    expect(ENV_VARS.GOOGLE_CLIENT_ID).toBe('dummy-google-client-id');
  });
});