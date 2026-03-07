/****************************************************************************************
 * Dijkstra's single-source shortest-paths algorithm in TypeScript
 *
 * Credits:
 *
 * 1) Original code written by Wyatt Baldwin and the Dijkstar Python project.
 * 2) Turned into a Node module by Thomas Cort in https://github.com/tcort/dijkstrajs.
 * 3) TypeScript port by https://samuelplumppu.se:
 *    Combining the JS version with the latest upstream Dijkstar Python implementation.
 *    Performance optimization using a port of the `heapq` library from Python.
 *
 * License: MIT
 *
 * Copyright (c) 2008 Wyatt Baldwin
 * Copyright (c) 2014 - 2023 Thomas Cort
 * Copyright (c) 2026 Samuel Plumppu
 *
 * This library includes derived code from the `heapq` library, ported from Python 3.14.3
 *
 * Original license: PSF-2.0
 * Copyright (c) 2001 Python Software Foundation. All rights reserved.
 ***************************************************************************************/

// NOTE: Public functions use camelCase to follow TS naming conventions.
// However, the internal variables and parameters preserve the names from the Python libraries
// Dijkstar and heapq to simplify comparisions and potential future updates.

/**
 * A Node in the graph.
 */
type Node = string

/**
 * Cost between two nodes in the graph
 */
type Cost = number

/**
 * This object holds the neighbors of a specific Node (start).
 * Each neighbor is defined as the Node (neighbor) and the associated cost to get there.
 */
type Neighbors = Record<Node, Cost>

/**
 * The graph of nodes and its connected neighbors.
 */
type Graph = Record<Node, Neighbors>

/**
 * Predecessor map for each node that has been reached from a given node.
 * Keys are nodes that have been reached; values are the cost to traverse
 * the edge from the predecessor node to the reached node.
 */
type Predecessors = Record<Node, Node>

type QueueItem = {
  value: Node
  cost: Cost
}

/**
 * Find the shortest path from `s` to `d` in `graph`.
 *
 * This is a wrapper around `single_source_shortest_paths` that
 * extracts path info from the the predecessor list. Look there for a
 * description of the args.
 *
 * @param graph The graph to search
 * @param s The source node from where to start
 * @param d The destination node
 * @returns An array with nodes
 */
export function findPath(graph: Graph, s: Node, d: Node): Node[] {
  const predecessors = singleSourceShortestPath(graph, s, d)
  return extractShortestPathFromPredecessors(predecessors, d)
}

/**
 * Find path from node `s` to all other nodes or just to `d`.
 *
 * @param graph An object describing how nodes are connected in the graph.
 *        The top-level object is a record mapping every `Node` in the graph to its `Neighbors`.
 *        `Neighbors` map each connected `Node` and the edge (`Cost`) to reach it.
 * @param s Start node.
 * @param d Destination node.
 *        If `d` is not specified, the algorithm is run normally
 *        (i.e., the paths from `s` to all reachable nodes are found).
 * @returns A predecessor map for each node that has been encountered.
 */
function singleSourceShortestPath(graph: Graph, s: Node, d?: Node) {
  // Current known costs of paths from `s` to all nodes that have been
  // reached so far. Note that "reached" is not the same as "visited".
  const costs: Record<Node, Cost> = {
    // Cost to reach starting node is 0
    [s]: 0,
  }

  // Predecessor map for each node that has been reached from `s`.
  // Keys are nodes that have been reached; values are the cost to traverse
  // the edge from the predecessor node to the reached node.
  const predecessors: Predecessors = {}

  // A priority queue of nodes with known costs from `s`. The nodes in
  // this queue are candidates for visitation. Nodes are added to this
  // queue when they are reached (but only if they have not already
  // been visited).
  const visit_queue = new PriorityQueue<QueueItem>((a, b) => a.cost - b.cost)
  visit_queue.push({ value: s, cost: 0 })

  // Nodes that have been visited. Once a node has been visited, it
  // won't be visited again. Note that in this context "visited" means
  // a node has been selected as having the lowest known cost (and it
  // must have been "reached" to be selected).
  const visited = new Set<Node>()

  while (visit_queue.length) {
    // In the nodes remaining in the graph that have a known cost
    // from `s`, find the node, `u`, that currently has the shortest path
    // from `s`.
    const { value: u, cost: cost_of_s_to_u } = visit_queue.pop()

    if (u === d) {
      // Abort as soon as we have found the destination
      // Depending on the start and destination, this might result in the
      // predecessors only containing a few nodes.
      // However, some paths require exploring the entire graph.
      break
    }

    if (visited.has(u)) {
      // This will happen when u has been reached from multiple
      // nodes before being visited (because multiple entries for
      // `u` will have been added to the visit queue).
      continue
    }

    visited.add(u)
    const neighbors = graph[u]

    if (!neighbors) {
      // `u` has no outgoing edges
      continue
    }

    // Check each of `u`'s neighboring nodes to see if we can update
    // its cost by reaching it from `u`.

    for (let [v, cost_of_e] of Object.entries(neighbors)) {
      if (visited.has(v)) {
        // Don't backtrack to nodes that have already been visited.
        continue
      }

      // Cost of `s` to `u` plus the `cost_of_e` for the edge between `u` and `v`
      // This is *a* cost from `s` to `v` that may or may not be less than
      // the current known cost to `v`.
      const cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e

      if (typeof costs[v] === 'undefined' || costs[v] > cost_of_s_to_u_plus_cost_of_e) {
        // If the current known cost from `s` to `v` is greater than
        // the cost of the path that was just found (cost of `s` to
        // `u` plus cost of `u` to `v` across `e`), update `v`'s cost in
        // the cost list and update `v`'s predecessor in the
        // predecessor list (it's now `u`). Note that if `v` is
        // not present in the `costs` list, its current cost
        // is considered to be infinity.
        costs[v] = cost_of_s_to_u_plus_cost_of_e
        predecessors[v] = u
        visit_queue.push({ value: v, cost: cost_of_s_to_u_plus_cost_of_e })
      }
    }
  }

  if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
    throw new Error(`Could not find a path from "${s}" to "${d}"`)
  }

  return predecessors
}

/**
 * Get an array of nodes that represent the shortest path to reach the destination `d`.
 *
 * @param predecessors The nodes that were reached in order to find `d`.
 * @param d The destination node.
 * @returns An array of nodes.
 */
function extractShortestPathFromPredecessors(predecessors: Predecessors, d: Node): Node[] {
  const nodes = []
  let u: string | undefined = d
  while (u) {
    nodes.push(u)
    u = predecessors[u]
  }
  return nodes.reverse()
}

type CompareFn<T> = (a: T, b: T) => number

/**
 * Optimized priority queue based on the `heapq` library, ported from Python.
 *
 * This version only includes the code required to implement a min-heap.
 *
 * Learn more: https://docs.python.org/3/library/heapq.html
 */
class PriorityQueue<T> {
  #heap: T[]
  #compare: CompareFn<T>

  constructor(compare: CompareFn<T>) {
    this.#heap = []
    this.#compare = compare
  }

  /**
   * Add a new item to the queue and ensure the highest priority element
   * is at the front of the queue.
   */
  push(item: T) {
    // Push item onto heap, maintaining the heap invariant.
    this.#heap.push(item)
    this.#siftdown(0, this.#heap.length - 1)
  }

  /**
   * Return the highest priority element in the queue.
   */
  pop() {
    // Pop the smallest item off the heap, maintaining the heap invariant.
    const lastelt = this.#heap.pop()
    if (!lastelt) throw new Error('Queue is empty')
    if (this.#heap.length) {
      const returnitem = this.#heap[0]!
      this.#heap[0] = lastelt
      this.#siftup(0)
      return returnitem
    }
    return lastelt
  }

  get length() {
    return this.#heap.length
  }

  /**
   * 'heap' is a heap at all indices >= startpos, except possibly for pos. pos
   * is the index of a leaf with a possibly out-of-order value. Restore the
   * heap invariant.
   */
  #siftdown(startpos: number, pos: number) {
    let newitem = this.#heap[pos]!
    // Follow the path to the root, moving parents down until finding a place newitem fits.
    while (pos > startpos) {
      let parentpos = (pos - 1) >> 1
      let parent = this.#heap[parentpos]!
      if (this.#compare(newitem, parent) < 0) {
        this.#heap[pos] = parent
        pos = parentpos
        continue
      }
      break
    }
    this.#heap[pos] = newitem
  }

  #siftup(pos: number) {
    const endpos = this.#heap.length
    const startpos = pos
    const newitem = this.#heap[pos]!
    // Bubble up the smaller child until hitting a leaf.
    let childpos = 2 * pos + 1 // leftmost child position
    while (childpos < endpos) {
      // Set childpos to index of smaller child.
      let rightpos = childpos + 1
      if (rightpos < endpos && this.#compare(this.#heap[childpos]!, this.#heap[rightpos]!) >= 0) {
        childpos = rightpos
      }
      // Move the smaller child up.
      this.#heap[pos] = this.#heap[childpos]!
      pos = childpos
      childpos = 2 * pos + 1
    }
    // The leaf at pos is empty now.  Put newitem there, and bubble it up
    // to its final resting place (by sifting its parents down).
    this.#heap[pos] = newitem
    this.#siftdown(startpos, pos)
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')

  describe('dijkstra', () => {
    describe(findPath.name, () => {
      it('should find the path between two nodes, all edges have weight 1', () => {
        // A B C
        // D E F
        // G H I
        const graph = {
          a: { b: 1, d: 1 },
          b: { a: 1, c: 1, e: 1 },
          c: { b: 1, f: 1 },
          d: { a: 1, e: 1, g: 1 },
          e: { b: 1, d: 1, f: 1, h: 1 },
          f: { c: 1, e: 1, i: 1 },
          g: { d: 1, h: 1 },
          h: { e: 1, g: 1, i: 1 },
          i: { f: 1, h: 1 },
        }
        const path = findPath(graph, 'a', 'i')
        expect(path).toStrictEqual(['a', 'b', 'c', 'f', 'i'])
      })

      it('should find the path between two nodes, weighted edges', () => {
        const graph = {
          a: { b: 10, c: 100, d: 1 },
          b: { c: 10 },
          d: { b: 1, e: 1 },
          e: { f: 1 },
          f: { c: 1 },
          g: { b: 1 },
        }

        let path = findPath(graph, 'a', 'c')
        expect(path).toStrictEqual(['a', 'd', 'e', 'f', 'c'])
        path = findPath(graph, 'd', 'b')
        expect(path).toStrictEqual(['d', 'b'])
      })

      it('should throw on unreachable destination', () => {
        const graph = {
          a: { b: 10, c: 100, d: 1 },
          b: { c: 10 },
          d: { b: 1, e: 1 },
          e: { f: 1 },
          f: { c: 1 },
          g: { b: 1 },
        }

        expect(() => {
          findPath(graph, 'c', 'a')
        }).toThrow()
        expect(() => {
          findPath(graph, 'a', 'g')
        }).toThrow()
      })

      it('should throw on non-existent destination', () => {
        const graph = {
          a: { b: 10, c: 100, d: 1 },
          b: { c: 10 },
          d: { b: 1, e: 1 },
          e: { f: 1 },
          f: { c: 1 },
          g: { b: 1 },
        }

        expect(() => {
          findPath(graph, 'a', 'z')
        }).toThrow()
      })

      it('should find the path in a small graph', () => {
        const graph = {
          a: { b: 1, c: 2 },
          b: { a: 1, d: 2, e: 2 },
          c: { d: 2 },
          d: { b: 2, c: 2, e: 1 },
          e: { b: 2, d: 1 },
        }
        const path = findPath(graph, 'a', 'd')
        expect(path).toStrictEqual(['a', 'b', 'd'])
      })

      it('should handle start and destination being the same node', () => {
        const graph = {
          a: { b: 1, c: 2 },
          b: { a: 1, d: 2, e: 2 },
          c: { d: 2 },
          d: { b: 2, c: 2, e: 1 },
          e: { b: 2, d: 1 },
        }
        const path = findPath(graph, 'a', 'a')
        expect(path).toStrictEqual(['a'])
      })

      it('should handle a large graph', () => {
        const graph = {
          a: { b: 10, d: 1 },
          b: { a: 1, c: 2, e: 3 },
          c: { b: 1, f: 2 },
          d: { a: 1, e: 2, g: 3 },
          e: { b: 1, d: 2, f: 3, h: 4 },
          f: { c: 1, e: 2, i: 3 },
          g: { d: 1, h: 2 },
          h: { e: 1, g: 2, i: 3 },
          i: { f: 1, h: 2 },
        }
        const path = findPath(graph, 'a', 'i')
        expect(path).toStrictEqual(['a', 'd', 'e', 'f', 'i'])
      })
    })

    describe(singleSourceShortestPath.name, () => {
      it('should find all paths from a node', () => {
        const graph = {
          a: { b: 10, c: 100, d: 1 },
          b: { c: 10 },
          d: { b: 1, e: 1 },
          e: { f: 1 },
          f: { c: 1 },
          g: { b: 1 },
        }

        // All paths from 'a'
        const paths = singleSourceShortestPath(graph, 'a')
        expect(paths).toStrictEqual({
          d: 'a',
          b: 'd',
          e: 'd',
          f: 'e',
          c: 'f',
        })
      })

      it('should give the same result when using the public API as when using internal APIs', () => {
        const graph = {
          a: { b: 10, c: 100, d: 1 },
          b: { c: 10 },
          d: { b: 1, e: 1 },
          e: { f: 1 },
          f: { c: 1 },
          g: { b: 1 },
        }

        // All paths from 'a'
        const paths = singleSourceShortestPath(graph, 'a')
        expect(paths).toStrictEqual({
          d: 'a',
          b: 'd',
          e: 'd',
          f: 'e',
          c: 'f',
        })

        const shortestPublic = findPath(graph, 'a', 'f')
        const shortestInternal = extractShortestPathFromPredecessors(paths, 'f')
        const expected = ['a', 'd', 'e', 'f']

        expect(shortestPublic).toStrictEqual(expected)
        expect(shortestInternal).toStrictEqual(expected)
      })

      it('should finish early as soon as the destination is found', () => {
        const graph = {
          a: { b: 10, c: 100, d: 1 },
          b: { c: 10 },
          d: { b: 1, e: 1 },
          e: { f: 1 },
          f: { c: 1 },
          g: { b: 1 },
        }

        let predecessors = singleSourceShortestPath(graph, 'a', 'c')
        expect(predecessors, 'returns all required nodes for a long path').toStrictEqual({
          b: 'd',
          c: 'f',
          d: 'a',
          e: 'd',
          f: 'e',
        })

        predecessors = singleSourceShortestPath(graph, 'd', 'b')
        expect(predecessors, 'returns only a few required nodes for a short path').toStrictEqual({
          b: 'd',
          e: 'd',
        })
      })
    })
  })
}
