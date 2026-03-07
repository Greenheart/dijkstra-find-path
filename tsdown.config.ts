import { defineConfig } from 'tsdown'

export default defineConfig({
  exports: true,
  dts: true,
  attw: {
    profile: "esm-only"
  },
  entry: "src/dijkstra.ts",
  define: {
    // Remove inline tests when building the library
    'import.meta.vitest': 'undefined',
  },
})
