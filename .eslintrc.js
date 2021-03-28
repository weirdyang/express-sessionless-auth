module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'import',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    allowAfterThis: 0,
    'import/no-unresolved': 'off',
    'import/named': 'warn',
    'import/namespace': 'warn',
    'import/no-named-as-default': 'off',
    'import/export': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.js', 'tests/**/*.js', '*.spec.js'],
      env: { mocha: true },
      rules: {
        'no-unused-expressions': 'off',
        'no-console': 'off',
        strict: ['error', 'never'],
      },
    },
  ],
};
