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

test('default getter should be $textContent', t => {
  t.strictSame(result.default, expected.default)
  t.strictSame(result.default, result.textContent)
  t.end()
})

test('$text should be an alias of $textContent', t => {
  t.strictSame(result.text, expected.text)
  t.strictSame(result.text, result.textContent)
  t.end()
})

test('$textNodes should only count for direct child nodes', t => {
  t.strictSame(result.textNodes, expected.textNodes)
  t.end()
})

test('should return matching attribute if getter is not one of the getters collection', t => {
  t.same(result.links, expected.links)
  t.end()
})

test('$outerHTML should return outer HTML of selected element', t => {
  t.strictSame(result.outerHTML, expected.outerHTML)
  t.end()
})

test('$html should be an alias for $outerHTML', t => {
  t.strictSame(result.html, expected.html)
  t.strictSame(result.html, expected.outerHTML)
  t.end()
})

test('$innerHTML should return inner HTML of selected element', t => {
  t.strictSame(result.innerHTML, expected.innerHTML)
  t.end()
})
