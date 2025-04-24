import js from '@eslint/js'
import importPlugin from "eslint-plugin-import";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({ ignores: ['dist'] }, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    import: importPlugin,
  },
  rules: {
    'object-curly-newline': ['error', {
      multiline: true,
      minProperties: 8
    }],
    'comma-spacing': ['error', { before: false, after: true }],
    indent: ['error', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['error', 'always'],
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal'],
      alphabetize: { order: 'asc' },
      'newlines-between': 'always'
    }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true },],
    'quote-props': ['error', 'as-needed', {
      keywords: false,
      unnecessary: true,
      numbers: false
    }],
  },
}, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['src/lib/remotion/**/*.{js,jsx,ts,tsx}'],
  rules: { 'no-restricted-imports': ['error', { patterns: ['@/*'] }] }
})
