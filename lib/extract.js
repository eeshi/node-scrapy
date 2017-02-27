'use strict'

// Module dependencies

const cssSelect = require('css-select')
const filters = require('./filters')
const getters = require('./getters')
const htmlparser2 = require('htmlparser2')
const parseQuery = require('./query-parser')
const _ = {
  isArray: Array.isArray,
  isPlainObject: require('lodash.isplainobject'),
  isString: require('lodash.isstring')
}

// Expose

module.exports = exports = extract

/**
 * Given an `html` string/buffer, extract data as described in the `model`.
 * @static
 * @public
 * @param  {string}           html    HTML string to parse
 * @param  {Object|string}    model   String or object describing the data to be extracted from the given HTML
 * @return {Object}
 */

function extract (html, model) {
  let dom = htmlparser2.parseDOM(html)
  return getItem(dom, model)
}

/**
 * Given a `dom`, traverse it to get the desired item
 * @static
 * @private
 * @param  {Object}                 dom       DOM node
 * @param  {(string|Array|Object)}  item      Data to extract
 * @return {string}                           A string or an array of strings with the extracted data
 */

function getItem (dom, item) {
  let data

  if (_.isPlainObject(item)) {
    data = {}
    for (let key in item) data[key] = getItem(dom, item[key])
  } else if (_.isArray(item)) {
    let query = parseQuery(item[0])
    let matches = cssSelect.selectAll(query.selector, dom)

    if (_.isArray(item[1]) || _.isPlainObject(item[1])) {
      data = matches.map(context => getItem(context, item[1]))
    } else {
      data = matches
        .map(resolveGetter(getters, query))
        .map(applyFilters.bind(null, filters, query))
    }
  } else if (_.isString(item)) {
    let query = parseQuery(item)
    let matches = cssSelect.selectOne(query.selector, dom)

    data = resolveGetter(getters, query)(matches)
    data = applyFilters(filters, query, data)
  }

  return data
}

/**
 * Given a getters collection and a query, decide what getter function to use
 * @static
 * @private
 * @param  {Object}     getters Simple collection of getter functions
 * @param  {Object}     query   Query object, containing a getter property
 * @return {Function}           A getter function
 */

function resolveGetter (getters, query) {
  // Default to $text / $textContent if no getter was provided in query
  if (query.getter === null) return getters.$textContent

  // Use requested getter function if it is part of the getters collection
  if (getters.hasOwnProperty(query.getter)) return getters[query.getter]

  // Simply return node attribute if a getter was requested in query
  // but doesn't exist in the getters collection
  return el => el.attribs[query.getter] || null
}

/**
 * Given a filters collection, a query object, and data to process, apply all
 * requested filters by query over the data
 * @static
 * @private
 * @param  {Object} filters Simple collection of filter functions
 * @param  {Object} query   Query object, containing a filters array property
 * @param  {string} data    Data to be transformed
 * @return {string}         Data after all filters have been applied in order
 */

function applyFilters (filters, query, data) {
  // Apply each filter declared in the query, passing the result of the last as
  // the argument of the next
  return query.filters.reduce((result, filter) => {
    // Check if the requested filter exists in the filters collection
    return filters.hasOwnProperty(filter.name)
      // if so, call it
      ? filters[filter.name].apply(null, [result].concat(filter.args))
      // if not, simply return the data as it was
      : result
  }, data)
}
