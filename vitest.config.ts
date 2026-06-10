import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      provider: 'v8',
    },
    disableConsoleIntercept: true,
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/helpers/init.ts'],
    testTimeout: 5000,
  },
})
