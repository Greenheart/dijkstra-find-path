import { Bench } from 'tinybench'
import pkg from '../package.json' with { type: 'json' }

const newVersion = `dijkstrats@${pkg.version}`
const baseVersion = `dijkstrajs@1.0.3`

const bench = new Bench({
  name: `Compare ${baseVersion} with optimized version`,
  setup: (_task, mode) => {
    // Run the garbage collector before warmup at each cycle
    if (mode === 'warmup' && typeof globalThis.gc === 'function') {
      globalThis.gc()
    }
  },
  time: 100,
})

bench
  .add(newVersion, () => {
    console.log('I am faster')
  })
  .add(baseVersion, async () => {
    await new Promise(resolve => setTimeout(resolve, 1)) // we wait 1ms :)
    console.log('I am slower')
  })

await bench.run()

console.log(bench.name)
console.table(bench.table())
