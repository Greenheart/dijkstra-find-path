# dijkstra-heapq

TypeScript implementation of Dijkstra's single-source shortest-paths algorithm, including performance optimizations based on the [heapq](https://docs.python.org/3/library/heapq.html) Python library.

The code was originally written by Wyatt Baldwin and turned into a Node.js module by Thomas Cort. Ported to TypeScript by [Samuel Plumppu](https://samuelplumppu.se).

## Features

- **Works with any JS runtime** since no platform-specific APIs are used.
- Tiny code footprint, making this suitable to include in web apps where the bundle size is important.

## Get started

```sh
pnpm install dijkstra-heapq
```

```ts
import { findPath } from 'dijkstra-heapq'

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

## License

MIT

This library includes derived code from the [heapq](https://docs.python.org/3/library/heapq.html) library, ported from Python 3.14.3
Original license for `heapq`: PSF-2.0
