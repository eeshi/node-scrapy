const { test } = require('tap')

const scrapy = require('../../server')

const { getFixtureSet } = require('../test-utils')

const { source, model, expected } = getFixtureSet(__dirname, __filename)

test("textContent should include children's textContent, without the actual tags", (t) => {
  const result = scrapy.extract(source, model)
  t.same(result, expected)
  t.end()
})
