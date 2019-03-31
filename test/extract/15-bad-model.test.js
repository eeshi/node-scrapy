const { test } = require('tap')

const scrapy = require('../../server/')
const { ModelError } = require('../../lib/errors')

const source = '<html></html>'

const circular = (() => {
  const a = {
    a: 'a',
  }

  const b = {
    b: 'b',
  }

  b.a = a
  a.b = b

  return a
})()

test('should throw when bad values are provided to the model', (t) => {
  t.throws(() => {
    scrapy.extract(source, 15)
  })
  t.throws(() => {
    scrapy.extract(source, NaN)
  })
  t.throws(() => {
    scrapy.extract(source, false)
  })
  t.throws(() => {
    scrapy.extract(source, undefined)
  })
  t.throws(() => {
    scrapy.extract(source, { nested: false })
  })
  t.throws(() => {
    scrapy.extract(source, circular)
  })
  t.end()
})

test('the error thrown on malformed model should be an instace of ModelError', (t) => {
  try {
    scrapy.extract(source, circular)
    throw new Error()
  } catch (error) {
    t.ok(error instanceof ModelError, `${error} is not an instance of ModelError`)
    t.end()
  }
})
