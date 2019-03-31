const cssSelect = require('css-select')
const { DomHandler, Parser } = require('htmlparser2')

const { ModelError } = require('../lib/errors')
const { extractItem } = require('../lib/extractItem')
const filters = require('../lib/filters')
const { DOMHANDLER_OPTIONS, HTMLPARSER2_OPTIONS } = require('../lib/options')

const getters = require('./getters')

/**
 * Given an `html` string, extract data as described in the `model`.
 * @static
 * @public
 * @param  {string} html HTML string to parse
 * @param  {Object|string} model String or object describing the data to be extracted from the
 * given HTML
 * @param  {Object} [options] Options for the parser and others
 * @return {Object}
 */

function extract(html, model, options = {}) {
  // Using Object.assign instead of object spread removes the need of null checks.
  const parserOptions = Object.assign({}, HTMLPARSER2_OPTIONS, options.htmlparser2)
  const handlerOptions = Object.assign({}, DOMHANDLER_OPTIONS, options.domhandler)

  let deserializedModel

  try {
    deserializedModel = JSON.parse(JSON.stringify(model))
  } catch (error) {
    throw new ModelError(`The model cannot be serialized; ${error.message}`)
  }

  const handler = new DomHandler(handlerOptions)
  const parser = new Parser(handler, parserOptions)

  parser.end(html)

  return extractItem(handler.dom, deserializedModel, cssSelect, getters, filters)
}

module.exports = {
  extract,
}
