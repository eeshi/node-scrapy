const { test } = require('tap')

const scrapy = require('../../server')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('should process single-string models as selector and return a string containing its textContent', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
