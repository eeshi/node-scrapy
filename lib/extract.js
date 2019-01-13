const cssSelect = require('css-select')
const { DomHandler, Parser } = require('htmlparser2')

const { UnknownFilterError } = require('./errors')
const filters = require('./filters')
const getters = require('./getters')
const { DOMHANDLER_OPTIONS, HTMLPARSER2_OPTIONS } = require('./options')
const { parseQuery } = require('./query-parser')
const {
  has, isArray, isObject, isString,
} = require('./utils')

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
  // Using Object.assig instead of object spread removes the need of null checks.
  const parserOptions = Object.assign({}, HTMLPARSER2_OPTIONS, options.htmlparser2)
  const handlerOptions = Object.assign({}, DOMHANDLER_OPTIONS, options.domhandler)

  const handler = new DomHandler(handlerOptions)
  const parser = new Parser(handler, parserOptions)

  parser.end(html)

  return getItem(handler.dom, model)
}

/**
 * Given a `dom`, traverse it to get the desired item
 * @static
 * @private
 * @param  {Object} dom DOM node
 * @param  {(string|Array|Object)} item Data to extract
 * @return {string} A string or an array of strings with the extracted data
 */

function getItem(dom, item) {
  let data

  if (isArray(item)) {
    const query = parseQuery(item[0])
    const matches = cssSelect.selectAll(query.selector, dom)

    if (isArray(item[1]) || isObject(item[1])) {
      data = matches.map((context) => getItem(context, item[1]))
    } else {
      data = matches.map(resolveGetter(getters, query)).map(applyFilters.bind(null, filters, query))
    }
  } else if (isObject(item)) {
    data = Object.keys(item).reduce((acc, key) => {
      acc[key] = getItem(dom, item[key])
      return acc
    }, {})
  } else if (isString(item)) {
    const query = parseQuery(item)
    const matches = cssSelect.selectOne(query.selector, dom)

    data = resolveGetter(getters, query)(matches)
    data = applyFilters(filters, query, data)
  }

  return data
}

/**
 * Given a getters collection and a query, decide what getter function to use
 * @static
 * @private
 * @param  {Object} collection Simple collection of getter functions
 * @param  {Object} query Query object, containing a getter property
 * @return {Function} A getter function
 */

function resolveGetter(collection, query) {
  // Default to $text / $textContent if no getter was provided in query
  if (query.getter === null) return collection.$textContent

  // Use requested getter function if it is part of the getters collection
  if (has(collection, query.getter)) return collection[query.getter]

  // Simply return node attribute if a getter was requested in query
  // but doesn't exist in the getters collection
  return (el) => el.attribs[query.getter] || null
}

/**
 * Given a filters collection, a query object, and data to process, apply all
 * requested filters by query over the data
 * @static
 * @private
 * @param  {Object} collection Simple collection of filter functions
 * @param  {Object} query Query object, containing a filters array property
 * @param  {string} data Data to be transformed
 * @return {string} Data after all filters have been applied in order
 */

function applyFilters(collection, query, data) {
  // Apply each filter declared in the query, passing the result of the last as
  // the argument of the next
  return query.filters.reduce((result, filter) => {
    // Check if the requested filter exists in the filters collection
    if (has(collection, filter.name)) {
      // if so, call it
      return collection[filter.name].apply(null, [result, ...filter.args])
    }
    // if not, throw error
    throw new UnknownFilterError(`Filter ${filter.name} does not exist.`)
  }, data)
}

module.exports = {
  extract,
}
