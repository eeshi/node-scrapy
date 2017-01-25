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
