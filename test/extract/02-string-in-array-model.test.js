const test = require('tap').test
const scrapy = require('../..')

const { getFixtureSet } = require('../test-utils')

const {
  source,
  model,
  expected
} = getFixtureSet(__dirname, __filename)

test('should process single-array with single-string as a multi-selection query and return array of textContent', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
