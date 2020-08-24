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
  if (!dom.hasAttribute(name)) return ''
  return dom.getAttribute(name)
}

/**
 * Get the outer HTML of the given node.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
 * @static
 * @public
 * @param {Object} dom DOM Element
 * @returns {string} Serialized HTML representation of the element itself and its descendants.
 */
function getOuterHTML(dom) {
  return dom.outerHTML
}

/**
 * Serialize DOM object into HTML string, excluding the top element
 * @static
 * @public
 * @param  {Object} dom DOM Element
 * @return {string} Serialized HTML representation of the DOM element's descendants.
 */
function getInnerHTML(dom) {
  return dom.innerHTML
}

/**
 * Gets all text content of a dom node, just like:
 * https://developer.mozilla.org/en/docs/Web/API/Node/textContent
 * @static
 * @public
 * @param  {Object} dom DOM Node
 * @return {string} DOM node's text content
 */
function getTextContent(dom) {
  return dom.textContent
}

/**
 * Gets concatenated dom's direct child text nodes' data.
 * @static
 * @public
 * @param  {Object} dom DOM Node
 * @return {string} Concatenation of direct text nodes' content
 */
function getTextNodes(dom) {
  if (dom.nodeType === 3) return dom.data
  if (!dom.childNodes) return ''
  return dom.childNodes.reduce(
    (text, nextChild) => (nextChild.nodeType === 3 ? text + nextChild.data : text),
    ''
  )
}

module.exports = {
  attribute: getAttribute,
  $: getTextContent,
  $innerHTML: getInnerHTML,
  $outerHTML: getOuterHTML,
  $textContent: getTextContent,
  $textNodes: getTextNodes,
}
