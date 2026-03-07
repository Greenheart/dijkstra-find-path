import { describe, it, expect } from 'vitest'
import dijkstra from './dijkstra.cjs'

const find_path = dijkstra.find_path.bind(dijkstra)

describe('dijkstra.js', () => {
  describe('.find_path()', () => {
    it('should find the path between two points, all edges have weight 1', () => {
      // A B C
      // D E F
      // G H I
      const graph = {
        a: { b: 10, d: 1 },
        b: { a: 1, c: 1, e: 1 },
        c: { b: 1, f: 1 },
        d: { a: 1, e: 1, g: 1 },
        e: { b: 1, d: 1, f: 1, h: 1 },
        f: { c: 1, e: 1, i: 1 },
        g: { d: 1, h: 1 },
        h: { e: 1, g: 1, i: 1 },
        i: { f: 1, h: 1 },
      }
      const path = find_path(graph, 'a', 'i')
      expect(path).toStrictEqual(['a', 'd', 'e', 'f', 'i'])
    })

    it('should find the path between two points, weighted edges', () => {
      const graph = {
        a: { b: 10, c: 100, d: 1 },
        b: { c: 10 },
        d: { b: 1, e: 1 },
        e: { f: 1 },
        f: { c: 1 },
        g: { b: 1 },
      }

      let path = find_path(graph, 'a', 'c')
      expect(path).toStrictEqual(['a', 'd', 'e', 'f', 'c'])
      path = find_path(graph, 'd', 'b')
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
        find_path(graph, 'c', 'a')
      }).toThrow()
      expect(() => {
        find_path(graph, 'a', 'g')
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
        find_path(graph, 'a', 'z')
      }).toThrow()
    })
  })

  describe('.single_source_shortest_paths()', () => {
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
      const paths = dijkstra.single_source_shortest_paths(graph, 'a')
      expect(paths).toStrictEqual({
        d: 'a',
        b: 'd',
        e: 'd',
        f: 'e',
        c: 'f',
      })
    })
  })
})
