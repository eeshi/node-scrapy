const test = require('tap').test
const scrapy = require('../..')

const { getFixtureSet } = require('../test-utils')

const {
  source,
  model,
  expected
} = getFixtureSet(__dirname, __filename)

test('arrays and objects in the model can be nested at any level', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
