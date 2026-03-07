# Changelog for `dijkstrats`

## Unreleased

Significant performance improvements compared to `dijkstrajs@1.0.3` by using a min-heap when traversing the graph.

This version is based on code and tests ported from the Python libraries Dijkstar and `heapq`, taking advantage of better algorithms and data structures.

Tested against the original test suite to match the behavior of `dijkstrajs@1.0.3`. Apart from a small naming change in the public API (see below), this is fully backwards compatible and maintains the same behavior.

### Breaking changes

- feat!: Simplify public API and hide internal implementation details:
  - `find_path` has been renamed to `findPath` but is otherwise fully backwards compatible.
  - All other methods and properties are now internal only to keep the public API simple.

### Other changes

- feat: Significant performance improvement for large graphs by using a min-heap, based on code ported from the `heapq` Python library.
- feat: Publish TypeScript definitions with the package.
- feat: Use modern ES features to simplify the code.
- feat: Modernize the test suite of `dijkstrajs@1.0.3` and use it to verify backwards compatibility.
- feat: Extended test suite to cover new performance optimizations.
- chore: Update license file to use standard MIT license format.

---

## 1.0.3 - 2023-04-15

- chore: upgrade dependencies

---

## 1.0.2 - 2021-05-26

- chore(deps): upgrade dependencies

---

## 1.0.1 - 2015-11-13

- fix: Handle nodes that don't exist
- feat: Improved test suite
- chore: Improved project docs

---

## 1.0.0 - 2014-05-17

Initial release.
