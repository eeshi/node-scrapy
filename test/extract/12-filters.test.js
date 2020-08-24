const { test } = require('tap')

const scrapy = require('../../server')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

const result = scrapy.extract(source, model)

test('normalizeWhitespace filter should replace 2-or-more consecutive whitespaces occurrences with a single space', (t) => {
  t.strictSame(result.whitespaceExcess, expected.whitespaceExcess)
  t.end()
})

test('normalizeWhitespace filter should should keep single whitespace ocurrences as they are', (t) => {
  t.strictSame(result.properWhitespace, expected.properWhitespace)
  t.end()
})

test('trim:right should remove trailing whitespace, and leading whitespace should be preserved', (t) => {
  t.strictSame(result.trimRight, expected.trimRight)
  t.end()
})

test('trim:left should remove leading whitespace, and trailing whitespace should be preserved', (t) => {
  t.strictSame(result.trimLeft, expected.trimLeft)
  t.end()
})

test('trim:both should remove all leading and trailing whitespace', (t) => {
  t.strictSame(result.trimBoth, expected.trimBoth)
  t.end()
})

test('trim without arguments should default to trim:both', (t) => {
  t.strictSame(result.trimAlone, expected.trimAlone)
  t.strictSame(result.trimAlone, result.trimBoth)
  t.end()
})

test('prefix should prefix text', (t) => {
  t.strictSame(result.prefix, expected.prefix)
  t.end()
})

test('suffix should suffix text', (t) => {
  t.strictSame(result.suffix, expected.suffix)
  t.end()
})

test('order of prefix and suffix filters should not matter', (t) => {
  t.strictSame(result.prefixAndSuffix, expected.prefixAndSuffix)
  t.strictSame(result.suffixAndPrefix, expected.suffixAndPrefix)
  t.strictSame(result.prefixAndSuffix, result.suffixAndPrefix)
  t.end()
})
