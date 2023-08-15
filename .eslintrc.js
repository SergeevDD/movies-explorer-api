module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': [1, { allow: ['_id'] }],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
  },
};
