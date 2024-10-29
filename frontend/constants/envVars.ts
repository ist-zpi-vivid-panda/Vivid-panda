export enum EnvType {
  DEV = 'development',
  PROD = 'production',
}

const ENV_VARS = Object.freeze({ ENV_TYPE: process.env.NEXT_PUBLIC_ENV_TYPE!.toLowerCase() as EnvType } as const);

export default ENV_VARS;
