import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
    environmentOptions: {
      prisma: {
        datasourceEnv: 'DATABASE_URL',
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
  },
}) 