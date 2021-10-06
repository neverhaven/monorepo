/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ['no-secrets'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },
  rules: {
    'no-unreachable': 'error',
    'no-secrets/no-secrets': ['error', { tolerance: 4.1 }],
    'import/no-self-import': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-deprecated': 'error',
    'import/no-mutable-exports': 'error',
    'import/first': 'error',
    'import/no-namespace': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'index'],
        alphabetize: { order: 'asc', caseInsensitive: false },
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-default-export': 'error',
    'import/no-anonymous-default-export': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_', args: 'all', caughtErrors: 'all' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      { allowNullableObject: false, allowNullableString: true, allowNullableBoolean: true, allowNullableNumber: true },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'prettier/prettier': 'warn',
  },
  ignorePatterns: ['node_modules', 'dist', 'out', '**/*.js'],
};
