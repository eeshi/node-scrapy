'use strict'

// Expose

module.exports = exports = {
  normalizeWhitespace: normalizeWhitespace
}

/**
 * Strips excess of whitespace
 * @param  {string}  inputString  string to be normalized
 * @return {string}               normalized string
 */
function normalizeWhitespace (inputString) {
  return inputString.replace(/\s+/g, ' ')
}
