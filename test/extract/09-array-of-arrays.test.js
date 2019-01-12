const { test } = require('tap')
const scrapy = require('../..')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('arrays with an array as second element should be treated as nested context', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
