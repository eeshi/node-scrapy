'use strict'

/**
 * @license
 * node-scrapy <https://github.com/eeshi/node-scrapy>
 * Copyright Stefan Maric, Adrian Obelmejias, and other contributors <https://github.com/eeshi/node-scrapy/graphs/contributors>
 * Released under MIT license <https://github.com/eeshi/node-scrapy/blob/master/LICENSE>
 */

module.exports = exports = queryParser

function queryParser (query) {
  return {
    selector: extractSelector(query),
    getter: extractGetter(query),
    filters: extractFilters(query)
  }
}

function extractSelector (query) {
  return query.split(/\s*(=>|\|)\s*/)[0]
}

function extractGetter (query) {
  let matches = query.match(/=>([^|]+)/)
  return matches ? matches[1].replace(/\s/g, '') : null
}

function extractFilters (query) {
  return query.split(/\s*\|\s*/).slice(1).map(extractFilterProperties)
}

function extractFilterProperties (filterString) {
  return {
    name: filterString.match(/^\w+/)[0],
    args: filterString.split(/:/).slice(1)
  }
}
