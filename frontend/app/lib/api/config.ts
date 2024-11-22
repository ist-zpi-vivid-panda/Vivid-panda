import ENV_VARS from '@/constants/envVars';

type ApiConfig = {
  root: string;
};

const config: ApiConfig = Object.freeze({
  root: `${ENV_VARS.METHOD}://${ENV_VARS.IP_ADDRESS}:${ENV_VARS.BACKEND_PORT}`,
} as const);

export default config;
