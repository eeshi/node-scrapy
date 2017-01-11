'use strict'

/**
 * @license
 * node-scrapy <https://github.com/eeshi/node-scrapy>
 * Copyright Stefan Maric, Adrian Obelmejias, and other contributors <https://github.com/eeshi/node-scrapy/graphs/contributors>
 * Released under MIT license <https://github.com/eeshi/node-scrapy/blob/master/LICENSE>
 * Heavily dependent on htmlparser2 <https://github.com/fb55/htmlparser2> and css-select <https://github.com/fb55/css-select>
 * Copyright Felix Böhm <me@feedic.com> (http://feedic.com)
 */

/**
 * Module dependencies
 */

let cssSelect = require('css-select')
let htmlparser2 = require('htmlparser2')
let utils = {
  isArray: Array.isArray,
  isPlainObject: require('lodash.isplainobject'),
  isString: require('lodash.isstring')
}

module.exports = exports = extract

/**
 * Given an `html` string/buffer, extract data as described in the `model`.
 * @static
 * @param  {string}           html    HTML string to parse
 * @param  {Object|string}    model   String or object describing the data to be extracted from the given HTML
 * @return {Object}
 */

function extract (html, model) {
  let dom = htmlparser2.parseDOM(html)
  return getItem(dom, model)
}

/**
 * Given a `dom`, traverse it to get the desired item
 * @param  {Object}                 dom       DOM node
 * @param  {(string|Array|Object)}  item      Data to extract
 * @return {string}                           a string or an array of strings with the extracted data
 */
function getItem (dom, item) {
  let data
  let matches

  if (utils.isPlainObject(item)) {
    data = {}
    for (let key in item) data[key] = getItem(dom, item[key])
  } else if (utils.isArray(item)) {
    matches = cssSelect.selectAll(item[0], dom)

    if (utils.isArray(item[1]) || utils.isPlainObject(item[1])) {
      data = matches.map(context => getItem(context, item[1]))
    } else {
      data = matches.map(getTextContent)
    }
  } else if (utils.isString(item)) {
    matches = cssSelect.selectOne(item, dom)
    data = getTextContent(matches)
  }

  return data
}

/**
 * Gets all text content of a dom node, just like:
 * https://developer.mozilla.org/en/docs/Web/API/Node/textContent
 * @param  {Object} dom DOM node
 * @return {string}     DOM node's text content
 */
function getTextContent (dom) {
  if (dom.children) {
    return dom.children.reduce((text, nextChild) => {
      return (text += getTextContent(nextChild))
    }, '')
  }
  return getTextNodes(dom)
}

/**
 * Gets concatenated dom's direct child text nodes' data.
 * @param  {Object} dom DOM node
 * @return {string}     concatenation of direct text nodes' content
 */
function getTextNodes (dom) {
  if (dom.type === 'text') return dom.data
  if (!dom.children) return ''
  return dom.children.reduce((text, nextChild) => {
    if (nextChild.type === 'text') text += nextChild.data
    return text
  }, '')
}
