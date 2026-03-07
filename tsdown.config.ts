import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/dijkstra.ts',
  define: {
    // Remove inline tests when building the library
    'import.meta.vitest': 'undefined',
  },
  exports: true,
  publint: true,
  dts: {
    compilerOptions: {
      declaration: true,
      isolatedDeclarations: true,
    },
  },
  attw: {
    profile: 'esm-only',
  },
})
