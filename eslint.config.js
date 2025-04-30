import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      'object-curly-newline': [
        'error',
        {
          multiline: true,
          minProperties: 8,
        },
      ],
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      indent: ['error', 2, { SwitchCase: 1 }],
      'object-curly-spacing': ['error', 'always'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
        },
      ],
      'react-refresh/only-export-components': ['off'],
      'quote-props': [
        'error',
        'as-needed',
        {
          keywords: false,
          unnecessary: true,
          numbers: false,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/lib/remotion/**/*.{js,jsx,ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['@/*'] }] },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    // ...
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }
)
