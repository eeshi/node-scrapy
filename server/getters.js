const { default: getOuterHTML} = require('dom-serializer')

/**
 * Get the outer HTML of the given node.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
 * @static
 * @public
 * @param {Object} dom DOM Element
 * @param {string} name The name of the attribute to retrieve.
 * @returns {string} The string content of the attribute.
 */
function getAttribute(dom, name) {
  return dom.attribs[name] || ''
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

module.exports = {
  attribute: getAttribute,
  $: getTextContent,
  $innerHTML: getInnerHTML,
  $outerHTML: getOuterHTML,
  $textContent: getTextContent,
  $textNodes: getTextNodes,
}
