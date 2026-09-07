import { defineConfig } from 'vitest/config'

/** Keep this package's tests independent from an enclosing DSH checkout. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
})
