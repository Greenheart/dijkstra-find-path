import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  define: {
    // Remove inline tests when building the library
    'import.meta.vitest': 'undefined',
  },
})
