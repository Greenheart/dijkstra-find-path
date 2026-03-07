import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  dts: true,
  entry: "src/dijkstra.ts",
  define: {
    // Remove inline tests when building the library
    'import.meta.vitest': 'undefined',
  },
})
