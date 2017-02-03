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
 * @param  {string}  input  string to be normalized
 * @return {string}         normalized string
 */

function normalizeWhitespace (input) {
  return input.replace(/\s+/g, ' ')
}

/**
 * Prefixes an affix to the input
 * @param  {string} input Sring to be prefixed
 * @param  {string} affix Affix to be prefixed
 * @return {string}       Prefixed input
 */

function prefix (input, affix) {
  return affix + input
}

/**
 * Suffixes an affix to the input
 * @param  {string} input Sring to be suffixed
 * @param  {string} affix Affix to be suffixed
 * @return {string}       Suffixed input
 */

function suffix (input, affix) {
  return input + affix
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
