const ApiConfig_LOCALHOST = Object.freeze({
  root: 'http://127.0.0.1:5000',
});

const configs = Object.freeze({
  DEV: ApiConfig_LOCALHOST,
});

export default configs['DEV'];
