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
 * const query = '.link => href | trim:both'
 *
 * parseQuery(query)
 * // => {
 * //   selector: '.link',
 * //   getter: 'href',
 * //   filters: [{ name: 'trim', args: ['both'] }]
 * // }
 */
function parseQuery(query) {
  const parser = new nearley.Parser(compiledGrammar)

  parser.feed(query)

  // Return the first result
  return parser.results.find(Boolean)
}

module.exports = {
  parseQuery,
}
