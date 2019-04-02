const nearley = require('nearley')

const grammar = require('../dist/grammar')

const compiledGrammar = nearley.Grammar.fromCompiled(grammar)

/**
 * Parse node-scrapy query syntax into handy object
 * @static
 * @public
 * @param  {string} query   Query string
 * @return {Object}         Parsed query
 *
 * @example
 * const query = '.link (href | trim:both)'
 *
 * parseQuery(query)
 * // => {
 * //   selector: '.link',
 * //   getter: 'href',
 * //   filters: [{ name: 'trim', args: ['both'] }]
 * // }
 */
function parseQuery(query) {
  const trimmed = query.replace(/(^\s+)|(\s+$)/g, '')
  const match = trimmed.match(/[\s^](\(.*\))$/)

  if (!match) {
    return {
      selector: trimmed,
      getter: null,
      filters: [],
    }
  }

  const queryExtension = match[0]
  const selector = trimmed.slice(0, trimmed.indexOf(queryExtension))

  const parser = new nearley.Parser(compiledGrammar)
  parser.feed(queryExtension.replace(/(^\s*\(\s*)|(\s*\)\s*$)/g, ''))

  // Return the first result
  return {
    selector,
    ...parser.results.find(Boolean),
  }
}

module.exports = {
  parseQuery,
}
