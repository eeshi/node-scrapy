const { test } = require('tap')
const scrapy = require('../../lib')
const { UnknownFilterError } = require('../../lib/errors')

const { getFixtureSet } = require('../test-utils')

const { source, model } = getFixtureSet(__dirname, __filename)

test('should throw on unknwon filter', (t) => {
  t.throws(() => {
    scrapy.extract(source, model)
  })
  t.end()
})

test('the error thrown on unkown filter should be an instace of UnknownFilterError', (t) => {
  try {
    scrapy.extract(source, model)
    throw new Error()
  } catch (error) {
    t.ok(error instanceof UnknownFilterError, `${error} is not an instance of UnknownFilterError`)
    t.end()
  }
})
