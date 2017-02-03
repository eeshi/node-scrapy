'use strict'

// Expose

module.exports = exports = {
  normalizeWhitespace: normalizeWhitespace,
  prefix: prefix,
  suffix: suffix,
  trim: trim
}

/**
 * Strips excess of whitespace
 * @static
 * @public
 * @param  {string}  input  String to be normalized
 * @return {string}         Normalized string
 */

function normalizeWhitespace (input) {
  return input.replace(/\s+/g, ' ')
}

/**
 * Prefixes an affix to the input
 * @static
 * @public
 * @param  {string} input Sring to be prefixed
 * @param  {string} affix Affix to be prefixed
 * @return {string}       Prefixed input
 */

function prefix (input, affix) {
  return affix + input
}

/**
 * Suffixes an affix to the input
 * @static
 * @public
 * @param  {string} input Sring to be suffixed
 * @param  {string} affix Affix to be suffixed
 * @return {string}       Suffixed input
 */

function suffix (input, affix) {
  return input + affix
}

/**
 * Trims leading or trailing whitespace, or both
 * @static
 * @public
 * @param  {string} input         String to be trimmed
 * @param  {string} [side=both]   What side to trim
 * @return {string}               Trimed string
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
