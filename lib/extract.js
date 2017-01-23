'use strict'

/**
 * @license
 * node-scrapy <https://github.com/eeshi/node-scrapy>
 * Copyright Stefan Maric, Adrian Obelmejias, and other contributors <https://github.com/eeshi/node-scrapy/graphs/contributors>
 * Released under MIT license <https://github.com/eeshi/node-scrapy/blob/master/LICENSE>
 */

/**
 * Module dependencies
 */

let cssSelect = require('css-select')
let htmlparser2 = require('htmlparser2')
let getters = require('./getters')
let parseQuery = require('./query-parser')
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
    let query = parseQuery(item[0])

    matches = cssSelect.selectAll(query.selector, dom)

    if (utils.isArray(item[1]) || utils.isPlainObject(item[1])) {
      data = matches.map(context => getItem(context, item[1]))
    } else {
      data = matches.map(
        getters.hasOwnProperty(query.getter)
          ? getters[query.getter]
          : getters.$textContent
      )
    }
  } else if (utils.isString(item)) {
    let query = parseQuery(item)
    matches = cssSelect.selectOne(query.selector, dom)
    data = (
      getters.hasOwnProperty(query.getter)
        ? getters[query.getter]
        : getters.$textContent
    )(matches)
  }

  return data
}
