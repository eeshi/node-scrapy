const { test } = require('tap')

const scrapy = require('../../server/')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('model and result structures should match', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
