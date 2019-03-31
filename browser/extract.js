// Even tho on the browser we might rely on the DOM's `querySelector` and `querySelectorAll`, we
// use css-select; since it offers more selectors than the standard specification, we want to
// also provide it on the browser to keep it consistent.
const cssSelect = require('css-select')
const browserAdapter = require('css-select-browser-adapter')

const { ModelError } = require('../lib/errors')
const { extractItem } = require('../lib/extractItem')
const filters = require('../lib/filters')
const { CSS_SELECT_OPTIONS } = require('../lib/options')
const { isString } = require('../lib/utils')

const getters = require('./getters')

const domParser = new window.DOMParser()

/**
 * Given an `html` string, extract data as described in the `model`.
 * @static
 * @public
 * @param  {string} html HTML string to parse
 * @param  {Object|string} model String or object describing the data to be extracted from the
 * given HTML
 * @return {Object}
 */

function extract(html, model, options = {}) {
  let deserializedModel

  try {
    deserializedModel = JSON.parse(JSON.stringify(model))
  } catch (error) {
    throw new ModelError(`The model cannot be serialized; ${error.message}`)
  }

  const cssSelectOptions = Object.assign(
    {
      adapter: browserAdapter,
    },
    CSS_SELECT_OPTIONS,
    options.cssSelectOptions
  )

  const selectorEngine = {
    is: (elem, query) => cssSelect.is(elem, query, cssSelectOptions),
    selectAll: (query, elems) => cssSelect.selectAll(query, elems, cssSelectOptions),
    selectOne: (query, elems) => cssSelect.selectOne(query, elems, cssSelectOptions),
  }

  const parsedHtml = isString(html)
    ? domParser.parseFromString(html, cssSelectOptions.xmlMode ? 'application/xml' : 'text/html')
    : html

  return extractItem(parsedHtml, deserializedModel, selectorEngine, getters, filters)
}

module.exports = {
  extract,
}
