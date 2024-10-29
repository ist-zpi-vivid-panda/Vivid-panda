import ENV_VARS, { EnvType } from '@/constants/envVars';

type ApiConfig = {
  root: string;
};

const ApiConfig_LOCALHOST: ApiConfig = Object.freeze({
  root: 'http://127.0.0.1:8081',
} as const);

const configs: Record<EnvType, ApiConfig> = Object.freeze({
  [EnvType.DEV]: ApiConfig_LOCALHOST,
  [EnvType.PROD]: ApiConfig_LOCALHOST, // no prod envitonment right now
} as const);

export default configs[ENV_VARS.ENV_TYPE];
