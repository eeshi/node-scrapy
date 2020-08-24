const CSS_SELECT_OPTIONS = Object.freeze({
  strict: false,
  xmlMode: false,
})

const DOMHANDLER_OPTIONS = Object.freeze({
  normalizeWhitespace: false,
  withEndIndices: false,
  withStartIndices: false,
})

const HTMLPARSER2_OPTIONS = Object.freeze({
  decodeEntities: true,
  lowerCaseAttributeNames: true,
  lowerCaseTags: true,
  recognizeCDATA: false,
  recognizeSelfClosing: false,
  xmlMode: false,
})

module.exports = {
  CSS_SELECT_OPTIONS,
  DOMHANDLER_OPTIONS,
  HTMLPARSER2_OPTIONS,
}
