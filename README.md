# dijkstrats

TypeScript implementation of Dijkstra's single-source shortest-paths algorithm, with performance optimizations based on the [heapq](https://docs.python.org/3/library/heapq.html) Python library.

The code was originally written by Wyatt Baldwin and turned into a Node.js module by Thomas Cort. Ported to TypeScript by [Samuel Plumppu](https://samuelplumppu.se).

## Features

- **Works with any JS runtime**: Pure JS implementation without any platform-specific APIs.
- **Tiny code footprint**: Only `0.54 kB` minified + gzipped, making this suitable to include in web apps where the bundle size is important.
- **Improved performance**: Using a min-heap which especially improves the performance of larger graphs. See benchmark below.
- **TypeScript** definitions included.
- Easy to upgrade from `dijkstrajs@1.0.3` thanks to the backwards-compatible API and implementation. Just rename one function and you're good to go. See the [CHANGELOG](./CHANGELOG.md) for a detailed upgrade guide.
- Comprehensive test suite, including the original tests from `dijkstrajs`, extended with new tests to verify the performance improvements.

## Get started

```sh
pnpm install dijkstrats
```

```ts
import { findPath } from 'dijkstrats'

const graph = {
  a: { b: 10, c: 100, d: 1 },
  b: { c: 10 },
  d: { b: 1, e: 1 },
  e: { f: 1 },
  f: { c: 1 },
  g: { b: 1 },
}

// Find the shortest path from 'a' to 'c'
let path = findPath(graph, 'a', 'c')
// ['a', 'd', 'e', 'f', 'c']

// Find the shortest path from 'd' to 'b'
path = findPath(graph, 'd', 'b')
// ['d', 'b']
```

## More examples

See the tests at the bottom of [src/dijkstra.ts](./src/dijkstra.ts) to find more example code.

## Benchmarks

Run benchmarks with `pnpm bench`.

## Comparing `dijkstrajs@1.0.3` (JS) with optimized version `dijkstrats@2.0.0` (TS):

```txt
┌─────────┬─────────────────────────┬────────────────────┬─────────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ (index) │ Task name               │ Latency avg (ns)   │ Latency med (ns)    │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├─────────┼─────────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ 0       │ `dijkstrajs@1.0.3 (JS)` │ `13664463 ± 1.10%` │ `13227474 ± 189456` │ `73 ± 0.90%`           │ `76 ± 1`               │ 147     │
│ 1       │ `dijkstrats@2.0.0 (TS)` │ `12701920 ± 1.77%` │ `12041805 ± 127453` │ `79 ± 1.36%`           │ `83 ± 1`               │ 158     │
└─────────┴─────────────────────────┴────────────────────┴─────────────────────┴────────────────────────┴────────────────────────┴─────────┘
```

Based on the sample graph in the benchmark, this library runs `9%` faster compared to the unoptimized version. This might not seem like much for a small graph, but for larger amounts of data, this adds up.

This is not a perfect benchmark, and I haven't included all large graphs I tested to keep the repo clean. However, this is a starting point to make sure this library performs well, and help catch performance regressions in the future. You're welcome to contribute to the project you find ways to further improve the library and benchmarks!

## License

MIT

This library includes derived code from the [heapq](https://docs.python.org/3/library/heapq.html) library, ported from Python 3.14.3
Original license for `heapq`: PSF-2.0
