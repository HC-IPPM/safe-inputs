import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
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
    ignores: ['src/i18n/locales', 'src/graphql/__generated__'],
  },
  ...fixupConfigRules(
    compat.extends(
      '../.eslintrc',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:react/jsx-runtime',
      'plugin:jsx-a11y/recommended',
      'plugin:@microsoft/sdl/react',
    ),
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    settings: {
      react: {
        version: '18',
      },

      'import/resolver': {
        node: {
          moduleDirectory: ['./', './node_modules/'],
        },
      },
    },

    rules: {
      'react/prop-types': 'off',
    },
  },
];
