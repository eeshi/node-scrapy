const test = require('tap').test
const scrapy = require('../..')

const { getFixtureSet } = require('../test-utils')

const {
  source,
  model,
  expected
} = getFixtureSet(__dirname, __filename)

test('arrays with an object as second element should be treated a model and the fist item would be trated as the scope', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
