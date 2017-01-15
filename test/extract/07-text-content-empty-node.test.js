'use strict'

let fs = require('fs')
let path = require('path')

let testName = path.basename(__filename, '.test.js')

let source = fs.readFileSync(path.join(__dirname, testName + '.source.html'), 'utf8')
let model = require(path.join(__dirname, testName + '.model'))
let expected = require(path.join(__dirname, testName + '.result'))

let test = require('tap').test
let scrapy = require('../..')

test('empty nodes and nodes without text children should not break getTextContent', t => {
  let result = scrapy.extract(source, model)
  t.deepEqual(result, expected)
  t.end()
})
