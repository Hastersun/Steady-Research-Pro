import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.ts', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off', // TypeScript handles this
      'no-case-declarations': 'off', // Allow declarations in case blocks
      'no-useless-escape': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version instead
    },
  },
  // 允许在 API 端点与库代码中使用 console（便于调试与日志）
  {
    files: ['src/pages/api/**/*.js', 'src/lib/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '*.config.js',
      '*.config.mjs',
      '*.config.cjs',
      '**/*.astro', // Temporarily ignore Astro files until we fix the parser
      'src/lib/error-handler.js',
      'tests/api-error-format.test.js',
    ],
  },
];
