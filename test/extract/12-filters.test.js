'use strict'

let fs = require('fs')
let path = require('path')

let testName = path.basename(__filename, '.test.js')

let source = fs.readFileSync(path.join(__dirname, testName + '.source.html'), 'utf8')
let model = require(path.join(__dirname, testName + '.model'))
let expected = require(path.join(__dirname, testName + '.result'))

let test = require('tap').test
let scrapy = require('../..')

let result = scrapy.extract(source, model)

test('normalizeWhitespace filter should replace 2-or-more consecutive whitespaces occurrences with a single space', t => {
  t.strictSame(result.whitespaceExcess, expected.whitespaceExcess)
  t.end()
})

test('normalizeWhitespace filter should should keep single whitespace ocurrences as they are', t => {
  t.strictSame(result.properWhitespace, expected.properWhitespace)
  t.end()
})

test('trim:right should remove trailing whitespace, and leading whitespace should be preserved', t => {
  t.strictSame(result.trimRight, expected.trimRight)
  t.end()
})

test('trim:left should remove leading whitespace, and trailing whitespace should be preserved', t => {
  t.strictSame(result.trimLeft, expected.trimLeft)
  t.end()
})

test('trim:both should remove all leading and trailing whitespace', t => {
  t.strictSame(result.trimBoth, expected.trimBoth)
  t.end()
})

test('trim without arguments should default to trim:both', t => {
  t.strictSame(result.trimAlone, expected.trimAlone)
  t.strictSame(result.trimAlone, result.trimBoth)
  t.end()
})
