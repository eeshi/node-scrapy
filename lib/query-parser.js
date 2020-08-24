const nearley = require('nearley')

const grammar = require('../dist/grammar')

const { trim } = require('./utils')

const compiledGrammar = nearley.Grammar.fromCompiled(grammar)

// This matches a pair of parentheses and its content at the end of the string, either at the start
// of the string or preceded by a whitespace. Examples:
//   "(whatever content here)"
//   "irrelevant text (whatever content here)"
// In both cases, the match will carry the "(whatever content here)" bit, the latter will also
// have a leading whitespace.
const queryExtensionPattern = /(?:^|\s)(\(.*\))$/
// This matches the parentheses plus any leading or trailing whitespace matched above, used to clean
// up the content. In both cases above, if we do a Sting#replace, we end up with the string:
//   "whatever content here"
const leadingAndTrailingBoundaries = /(^\s*\(\s*)|(\s*\)\s*$)/g

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
  const trimmed = trim(query)
  const match = trimmed.match(queryExtensionPattern)

  if (!match) {
    return {
      selector: trimmed,
      getter: null,
      filters: [],
    }
  }

  const queryExtension = match.find(Boolean)
  const selector = trim(trimmed.slice(0, trimmed.indexOf(queryExtension)))
  const queryExtensionContent = queryExtension.replace(leadingAndTrailingBoundaries, '')

  const parser = new nearley.Parser(compiledGrammar)
  parser.feed(queryExtensionContent)

  // Return the first result
  return {
    selector,
    ...parser.results.find(Boolean),
  }
}

module.exports = {
  parseQuery,
}
