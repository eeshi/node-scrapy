// Module dependencies

const getOuterHTML = require('dom-serializer')

// Expose

module.exports = {
  $textContent: getTextContent,
  $text: getTextContent,
  $textNodes: getTextNodes,
  $outerHTML: getOuterHTML,
  $html: getOuterHTML,
  $innerHTML: getInnerHTML,
}

/**
 * Gets all text content of a dom node, just like:
 * https://developer.mozilla.org/en/docs/Web/API/Node/textContent
 * @static
 * @public
 * @param  {Object} dom DOM node
 * @return {string} DOM node's text content
 */

function getTextContent(dom) {
  if (dom.children) {
    return dom.children.reduce((text, nextChild) => text + getTextContent(nextChild), '')
  }
  return getTextNodes(dom)
}

/**
 * Gets concatenated dom's direct child text nodes' data.
 * @static
 * @public
 * @param  {Object} dom DOM node
 * @return {string} Concatenation of direct text nodes' content
 */

function getTextNodes(dom) {
  if (dom.type === 'text') return dom.data
  if (!dom.children) return ''
  return dom.children.reduce(
    (text, nextChild) => (nextChild.type === 'text' ? text + nextChild.data : text),
    ''
  )
}

/**
 * Serialize DOM object into HTML string, excluding the top element
 * @static
 * @public
 * @param  {Object} dom DOM node
 * @return {string} Serialized innerHTML string
 */

function getInnerHTML(dom) {
  if (!dom.children) return ''
  return dom.children.reduce((s, el) => s + getOuterHTML(el), '')
}
