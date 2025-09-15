import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
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

export default defineConfig([{
    extends: compat.extends('plugin:react/recommended'),

    plugins: {
        react,
        '@typescript-eslint': typescriptEslint,
        'react-hooks': fixupPluginRules(reactHooks),
        'import': fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 13,
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        'max-len': 'off',
        'require-jsdoc': 'off',
        'indent': ['error', 4, { SwitchCase: 1 }],
        'object-curly-spacing': [2, 'always'],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'operator-linebreak': [2, 'before'],
        'import/no-default-export': 'error',
        'import/export': 'error',
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-closing-bracket-location': 'error',
        'react/jsx-wrap-multilines': 'error',
        'react/hook-use-state': 'error',
        'react/no-danger': 'error',
        'react/no-this-in-sfc': 'error',
        'react/no-unsafe': 'error',
        'react/no-unstable-nested-components': 'error',
        'react/jsx-curly-brace-presence': 'error',
        'react/jsx-no-useless-fragment': 'error',

        // Define some rules like eslint-config-google:
        'no-cond-assign': 'off',
        'no-irregular-whitespace': 'error',
        'no-unexpected-multiline': 'error',
        'curly': ['error', 'multi-line'],
        'guard-for-in': 'error',
        'no-caller': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-new-wrappers': 'error',
        'no-throw-literal': 'error',
        'no-with': 'error',
        'prefer-promise-reject-errors': 'error',
        'array-bracket-newline': 'off',
        'array-bracket-spacing': ['error', 'never'],
        'array-element-newline': 'off',
        'block-spacing': ['error', 'never'],
        'brace-style': 'error',
        'camelcase': ['error', { properties: 'never' }],
        'comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': 'error',
        'comma-style': 'error',
        'computed-property-spacing': 'error',
        'eol-last': 'error',
        'func-call-spacing': 'error',
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'linebreak-style': 'error',
        'new-cap': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multiple-empty-lines': ['error', { max: 2 }],
        'no-new-object': 'error',
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'one-var': ['error', {
            var: 'never',
            let: 'never',
            const: 'never',
        }],
        'padded-blocks': ['error', 'never'],
        'quote-props': ['error', 'consistent'],
        'quotes': ['error', 'single', { allowTemplateLiterals: true }],
        'semi': 'error',
        'semi-spacing': 'error',
        'space-before-blocks': 'error',
        'space-before-function-paren': ['error', {
            asyncArrow: 'always',
            anonymous: 'never',
            named: 'never',
        }],
        'spaced-comment': ['error', 'always'],
        'switch-colon-spacing': 'error',
        'arrow-parens': ['error', 'always'],
        'constructor-super': 'error',
        'generator-star-spacing': ['error', 'after'],
        'no-new-symbol': 'error',
        'no-this-before-super': 'error',
        'no-var': 'error',
        'prefer-const': ['error', { destructuring: 'all' }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'rest-spread-spacing': 'error',
        'yield-star-spacing': ['error', 'after'],
    },
}, {
    files: ['eslint.config.js'],
    rules: {
        'import/no-default-export': 'off',
    },
}]);
