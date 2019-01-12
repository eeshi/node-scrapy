const { test } = require('tap')
const scrapy = require('../..')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test('empty nodes and nodes without text children should not break getTextContent', (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
