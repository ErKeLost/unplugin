// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  { vue: true },
  {
    ignores: [
      'test-out/**',
      '**/output.js',
      'docs/showcase/*.md',
      'docs/.vitepress/data/repository.json',
    ],
  },
  {
    files: ['**/fixtures/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'unicorn/prefer-node-protocol': 'off',
    },
  },
  {
    files: ['**/src/**/*.ts'],
    rules: {
      'node/no-unsupported-features/node-builtins': 'error',
      'node/no-unsupported-features/es-builtins': 'error',
    },
  },
)
