const { test } = require('tap')

const scrapy = require('../../server')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('arrays inside nested objects should resolve in the result as array of textContent', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
