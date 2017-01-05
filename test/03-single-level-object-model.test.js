'use strict'

let fs = require('fs')
let path = require('path')

let testName = path.basename(__filename, '.test.js')

let source = fs.readFileSync(path.join(__dirname, testName + '.source.html'), 'utf8')
let model = require(path.join(__dirname, testName + '.model'))
let expected = require(path.join(__dirname, testName + '.result'))

let test = require('tap').test
let scrapy = require('..')

test('should process object values as selectors and return object with same structure, containing testContent of each selector', t => {
  let result = scrapy.extract(source, model)
  t.deepEqual(result, expected)
  t.end()
})
