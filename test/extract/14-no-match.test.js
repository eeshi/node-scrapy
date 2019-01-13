const { test } = require('tap')
const scrapy = require('../../lib')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('should null-fill when no matches are found', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
