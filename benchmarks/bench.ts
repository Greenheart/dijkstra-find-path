import { Bench } from 'tinybench'
import pkg from '../package.json' with { type: 'json' }

import dijkstraJS from '../original/dijkstra.cjs'
import * as djikstraTSButOldLogic from '../original/dijkstra.ts'
import { findPath }  from '../dist/dijkstra.mjs'

import BIG_GRAPH from './big-graph.json' with { type: 'json' }

const newVersion = `dijkstrats@${pkg.version}`
const baseVersion = `dijkstrajs@1.0.3`

console.log('\nRunning benchmark for ' + newVersion + '\n')

const bench = new Bench({
  name: `Compare ${baseVersion} with optimized version ${newVersion}`,
  setup: (_task, mode) => {
    // Run the garbage collector before warmup at each cycle
    if (mode === 'warmup' && typeof globalThis.gc === 'function') {
      globalThis.gc()
    }
  },
  time: 2000,
  // warmupTime: 2000,
  // iterations: 5000,
})

bench
  .add('TS port', () => {
    const _path = djikstraTSButOldLogic.find_path(BIG_GRAPH, 'start', 'end')
  })
  .add(baseVersion, () => {
    const _path = dijkstraJS.find_path(BIG_GRAPH, 'start', 'end')
  })
  .add(newVersion, () => {
    const _path = findPath(BIG_GRAPH, 'start', 'end')
  })

await bench.run()

console.log(bench.name)
console.table(bench.table())
