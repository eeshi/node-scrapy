'use strict'

/**
 * @license
 * node-scrapy <https://github.com/eeshi/node-scrapy>
 * Copyright Stefan Maric, Adrian Obelmejias, and other contributors <https://github.com/eeshi/node-scrapy/graphs/contributors>
 * Released under MIT license <https://github.com/eeshi/node-scrapy/blob/master/LICENSE>
 */

module.exports = exports = {
  normalizeWhitespace: normalizeWhitespace
}

/**
 * Strips excess of whitespace
 * @param  {String}  inputString  string to be normalized
 * @return                        normalized string
 */
function normalizeWhitespace (inputString) {
  return inputString.replace(/\s+/g, ' ')
}
