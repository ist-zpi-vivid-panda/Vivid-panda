const ApiConfig_LOCALHOST = Object.freeze({
  root: 'http://127.0.0.1:8081',
});

const configs = Object.freeze({
  DEV: ApiConfig_LOCALHOST,
});

export default configs.DEV;
