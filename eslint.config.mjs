import {
  fixupConfigRules,
  fixupConfigRules,
  fixupConfigRules,
} from '@eslint/compat';
import noSecrets from 'eslint-plugin-no-secrets';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'kubernetes/mongodb-operator/operator',
      '**/dist',
      'ui/src/graphql/__generated__',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'neostandard',
      'prettier',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@microsoft/sdl/common',
    ),
  ),
  {
    plugins: {
      'no-secrets': noSecrets,
    },

    rules: {
      camelcase: 'off',
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-throw-literal': 'error',

      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*'],
        },
      ],

      'import/order': [
        'warn',
        {
          'newlines-between': 'always-and-inside-groups',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            ['sibling', 'index'],
          ],
          pathGroups: [],
        },
      ],

      'import/extensions': ['error', 'ignorePackages'],
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_.+',
        },
      ],

      '@typescript-eslint/no-redeclare': 'error',

      '@typescript-eslint/ban-types': [
        'error',
        {
          types: {
            'React.FunctionalComponent': {
              message:
                'FunctionalComponent is discouraged, prefer a plain function. See https://github.com/facebook/create-react-app/pull/8177',
            },

            'React.FC': {
              message:
                'FC is discouraged, prefer a plain function. See https://github.com/facebook/create-react-app/pull/8177',
            },
          },
        },
      ],

      'no-secrets/no-secrets': 'error',
    },
  },
  ...fixupConfigRules(compat.extends('plugin:@microsoft/sdl/typescript')).map(
    (config) => ({
      ...config,
      files: ['api/**/*.ts', 'api/**/*.tsx'],
    }),
  ),
  {
    files: ['api/**/*.ts', 'api/**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['./api/tsconfig.json'],
      },
    },
  },
  ...fixupConfigRules(compat.extends('plugin:@microsoft/sdl/typescript')).map(
    (config) => ({
      ...config,
      files: ['ui/**/*.ts', 'ui/**/*.tsx'],
    }),
  ),
  {
    files: ['ui/**/*.ts', 'ui/**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['./ui/tsconfig.json'],
      },
    },
  },
  {
    files: ['**/*test.js', '**/*test.ts', '**/*test.tsx'],

    plugins: {
      jest,
    },

    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },

    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  {
    files: ['**/*.cjs'],

    rules: {
      '@typescript-eslint/no-var-requires': 0,
    },
  },
];
