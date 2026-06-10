import herokuEslintConfig from '@heroku-cli/test-utils/eslint-config'
import vitestEslintConfig from '@heroku-cli/test-utils/eslint-config/vitest'

export default [
  ...herokuEslintConfig,
  ...vitestEslintConfig,
  {
    ignores: [
      './dist',
      'coverage/**/*',
    ],
  },
  {
    files: [
      '**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    rules: {
      camelcase: 'off',
    },
  },
]
