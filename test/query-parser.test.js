'use strict'

let test = require('tap').test
let parse = require('../lib/query-parser')

test('should extract CSS selector from query and keep it intact', t => {
  let query = '.home li > a'
  let result = parse(query)
  t.strictSame(result.selector, query)
  t.end()
})

test('should return null for `getter` if not present in the query', t => {
  let query = '.home li > a'
  let result = parse(query)
  t.strictSame(result.getter, null)
  t.end()
})

test('should return empty array for `filters` if not present in the query', t => {
  let query = '.home li > a'
  let result = parse(query)
  t.same(result.filters, [])
  t.end()
})

test('should extract `getter` from query if present', t => {
  let query = '.home li > a => href'
  let result = parse(query)
  t.strictSame(result.getter, 'href')
  t.end()
})

test('should ignore whitespace around and in between `getter`', t => {
  let query = `.home li > a =>   hr e
    f  `
  let result = parse(query)
  t.strictSame(result.getter, 'href')
  t.end()
})

test('should extract filter name', t => {
  let query = '.home li > a | trim'
  let result = parse(query)
  t.strictSame(result.filters[0].name, 'trim')
  t.end()
})

test('should extract all filter names in order', t => {
  let query = '.home li > a | trim | normalizeWhitespace'
  let result = parse(query)
  t.strictSame(result.filters[0].name, 'trim')
  t.strictSame(result.filters[1].name, 'normalizeWhitespace')
  t.end()
})
