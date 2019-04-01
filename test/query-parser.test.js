const { test } = require('tap')
const { parseQuery } = require('../lib/query-parser')

test('should extract CSS selector from query and keep it intact', (t) => {
  const query = '.home li > a'
  const result = parseQuery(query)
  t.strictSame(result.selector, '.home li > a')
  t.end()
})

test('should extract CSS selector from query and keep it intact, even if getter query is present', (t) => {
  const query = '.home li > a => $textContent'
  const result = parseQuery(query)
  t.strictSame(result.selector, '.home li > a')
  t.end()
})

test('should extract CSS selector from query and keep it intact, even if filter query is present', (t) => {
  const query = '.home li > a | trim:both'
  const result = parseQuery(query)
  t.strictSame(result.selector, '.home li > a')
  t.end()
})

test('should extract CSS selector from query and keep it intact, even if getter and filter queries are present', (t) => {
  const query = '.home li > a => $textContent | trim:both'
  const result = parseQuery(query)
  t.strictSame(result.selector, '.home li > a')
  t.end()
})

test('should return null for `getter` if not present in the query', (t) => {
  const query = '.home li > a'
  const result = parseQuery(query)
  t.strictSame(result.getter, null)
  t.end()
})

test('should extract `getter` from query if present', (t) => {
  const query = '.home li > a => href'
  const result = parseQuery(query)
  t.strictSame(result.getter, 'href')
  t.end()
})

test('should ignore whitespace around `getter`', (t) => {
  const query = '.home li > a =>   href  '
  const result = parseQuery(query)
  t.strictSame(result.getter, 'href')
  t.end()
})

test('should return empty array for `filters` if not present in the query', (t) => {
  const query = '.home li > a'
  const result = parseQuery(query)
  t.same(result.filters, [])
  t.end()
})

test('should extract filter name', (t) => {
  const query = '.home li > a | trim'
  const result = parseQuery(query)
  t.strictSame(result.filters[0].name, 'trim')
  t.end()
})

test('should extract all filter names in order', (t) => {
  const query = '.home li > a | trim | normalizeWhitespace'
  const result = parseQuery(query)
  t.strictSame(result.filters[0].name, 'trim')
  t.strictSame(result.filters[1].name, 'normalizeWhitespace')
  t.end()
})

test("should extract filters' argument as strings when quoted", (t) => {
  const query = '.home li > a | trim:"right" | anotherFilter:"test"'
  const result = parseQuery(query)
  t.strictSame(result.filters[0].args[0], 'right')
  t.strictSame(result.filters[1].args[0], 'test')
  t.end()
})

test("should extract filters' argument symbos as strings", (t) => {
  const query = '.home li > a | trim:right | anotherFilter:test'
  const result = parseQuery(query)
  t.strictSame(result.filters[0].args[0], 'right')
  t.strictSame(result.filters[1].args[0], 'test')
  t.end()
})

test('should return empty array for filter arguments if none provided', (t) => {
  const query = '.home li > a | trim'
  const result = parseQuery(query)
  t.same(result.filters[0].args, [])
  t.end()
})

test("should extract all filter's colon-separated arguments as strings in order", (t) => {
  const query = '.home li > a | trim:left:right:both'
  const result = parseQuery(query)
  t.strictSame(result.filters[0].args[0], 'left')
  t.strictSame(result.filters[0].args[1], 'right')
  t.strictSame(result.filters[0].args[2], 'both')
  t.end()
})
