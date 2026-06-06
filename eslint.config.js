import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';

export default defineConfig([
    js.configs.recommended,
    react.configs.flat.recommended,
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],

        plugins: {
            '@typescript-eslint': typescriptEslint,
            'react-hooks': reactHooks,
            'import': importPlugin,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                __DEV__: 'readonly',
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

        rules: {
            ...reactHooks.configs['recommended-latest'].rules,

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
    },
    {
        files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
    {
        files: ['*.config.{js,ts}', 'babel.config.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
]);
