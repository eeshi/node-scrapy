'use strict'

/**
 * @license
 * node-scrapy <https://github.com/eeshi/node-scrapy>
 * Copyright Stefan Maric, Adrian Obelmejias, and other contributors <https://github.com/eeshi/node-scrapy/graphs/contributors>
 * Released under MIT license <https://github.com/eeshi/node-scrapy/blob/master/LICENSE>
 */

let getOuterHTML = require('dom-serializer')

module.exports = exports = {
  $textContent: getTextContent,
  $text: getTextContent,
  $textNodes: getTextNodes,
  $outerHTML: getOuterHTML,
  $html: getOuterHTML,
  $innerHTML: getInnerHTML
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

function getInnerHTML (dom) {
  if (!dom.children) return ''
  return dom.children.reduce((s, el) => s + getOuterHTML(el), '')
}
