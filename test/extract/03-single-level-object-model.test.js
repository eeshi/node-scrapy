const { test } = require('tap')

const scrapy = require('../../server/')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('should process object values as selectors and return object with same structure, containing testContent of each selector', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
