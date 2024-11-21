/* eslint-disable n/no-extraneous-import */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line import/namespace
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
// eslint-disable-next-line n/no-unpublished-import
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    '../.eslintrc',
    'plugin:n/recommended',
    'plugin:security/recommended-legacy',
    'plugin:@microsoft/sdl/node',
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    settings: {
      'import/resolver': {
        node: {
          moduleDirectory: ['./', './node_modules/'],
        },
      },
    },

    rules: {
      'n/no-unsupported-features/es-syntax': [
        'error',
        {
          ignores: ['modules'],
        },
      ],

      'n/no-unsupported-features/node-builtins': [
        'error',
        {
          ignores: ['fetch'],
        },
      ],

      'n/no-missing-import': 0,

      'n/no-extraneous-import': [
        'error',
        {
          allowModules: ['src'],
        },
      ],

      'no-console': 0,
      'security/detect-object-injection': 0,
    },
  },
  {
    files: ['**/*.test.unit.js', '**/test.e2e.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
