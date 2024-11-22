const METHOD = process.env.NEXT_PUBLIC_METHOD;
const IP_ADDRESS = process.env.NEXT_PUBLIC_IP_ADDRESS;
const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;

if (!METHOD) {
  throw new Error('METHOD env var not read');
}

if (!IP_ADDRESS) {
  throw new Error('IP_ADDRESS env var not read');
}

if (!BACKEND_PORT) {
  throw new Error('BACKEND_PORT env var not read');
}

const ENV_VARS = Object.freeze({ METHOD: METHOD, IP_ADDRESS, BACKEND_PORT: Number(BACKEND_PORT) } as const);

export default ENV_VARS;
