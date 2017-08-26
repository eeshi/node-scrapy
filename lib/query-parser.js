// Expose

module.exports = queryParser

/**
 * Parse node-scrapy query syntax into handy object
 * @static
 * @public
 * @param  {string} query   Query string
 * @return {Object}         Parsed query
 *
 * @example
 * const query = '.link => href | trim:both'
 *
 * queryParser(query)
 * // => {
 * //   selector: '.link',
 * //   getter: 'href',
 * //   filters: [{ name: 'trim', args: ['both'] }]
 * // }
 */

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
  const matches = query.match(/=>([^|]+)/)
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
