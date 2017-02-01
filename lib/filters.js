'use strict'

// Expose

module.exports = exports = {
  normalizeWhitespace: normalizeWhitespace,
  trim: trim
}

/**
 * Strips excess of whitespace
 * @param  {string}  input  string to be normalized
 * @return {string}         normalized string
 */

function normalizeWhitespace (input) {
  return input.replace(/\s+/g, ' ')
}

/**
 * Trims leading or trailing whitespace, or both
 * @param  {string} input         string to be trimmed
 * @param  {string} [side=both]   what side to trim
 * @return {string}               trimed string
 */

function trim (input, side) {
  if ([undefined, 'both', 'left'].some(op => op === side)) {
    input = input.replace(/^\s*/, '')
  }

  if ([undefined, 'both', 'right'].some(op => op === side)) {
    input = input.replace(/\s*$/, '')
  }

  return input
}
