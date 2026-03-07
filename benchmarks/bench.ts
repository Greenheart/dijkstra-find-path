import { Bench } from 'tinybench'
import pkg from '../package.json' with { type: 'json' }

import dijkstraJS from '../original/dijkstra.cjs'
import { findPath }  from '../dist/dijkstra.mjs'

import BIG_GRAPH from './big-graph.json' with { type: 'json' }

const newVersion = `dijkstrats@${pkg.version}`
const baseVersion = `dijkstrajs@1.0.3`

const time = 2000
const iterations = 5000
const warmupIterations = 16
const completedIn = 'Completed in'

console.log('\nRunning benchmark for ' + newVersion + '\n')

const bench = new Bench({
  name: `Compare ${baseVersion} with optimized version ${newVersion}`,
  setup: (_task, mode) => {
    // Run the garbage collector before warmup at each cycle
    if (mode === 'warmup' && typeof globalThis.gc === 'function') {
      globalThis.gc()
    }
  },
  time,
  warmupTime: time,
  iterations,
  warmupIterations,
  concurrency: 'task',
})
bench
  .add(baseVersion, () => {
    const _path = dijkstraJS.find_path(BIG_GRAPH, 'start', 'end')
  })
  .add(newVersion, () => {
    const _path = findPath(BIG_GRAPH, 'start', 'end')
  })

console.time(completedIn)
await bench.run()
console.timeEnd(completedIn)

console.log(bench.name)
console.table(bench.table())
