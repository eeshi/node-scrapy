/**
 * Module dependencies
 */

var request = require('request');
var cheerio = require('cheerio');
var _ = require('./lodash.custom.js');

/**
 * A bunch of handy defaults.
 * @type {Object}
 */

var DEFAULTS = require('./defaults.json');

/**
 * Expose `scrapy` and its `scrape()` method.
 */

var scrapy = {};
scrapy.scrape = scrape;
module.exports = exports = scrapy;

/**
 * Add `defaultsDeep` method to lodash (`_`),
 * a recursive defaults loader.
 *
 * @param {Object} destination  The destination object
 * @param {Object} source       The source object
 *
 * @return {Object}             The `destination` object with new properties
 *
 * @example
 *
 * var DEFAULTS = {
 *   likes: ['javascript'],
 *   active: false,
 *   org: 'eeshi',
 *   mainProject: {
 *     name: 'node-scrapy',
 *     org: 'esshi'
 *   }
 * }
 *
 * var sam = {
 *   name: 'Sam',
 *   likes: ['html','css'],
 *   active: true,
 *   mainProject: {
 *     name: 'supervisor'
 *   }
 * }
 *
 * _.defaultsDeep(sam, DEFAULTS)
 * // {name:"Sam",likes:["html","css"],active:true,mainProject:{name:"supervisor",org:"esshi"},org:"eeshi"}
 *
 * sam.mainProject === DEFAULTS.mainProject
 * // false
 */

_.mixin({
  'defaultsDeep': _.partialRight(_.merge, function deep(value, other) {
      return _.merge(value, other, deep);
    })
});

/**
 * Scrape a web page
 * @param  {string}   url           Valid URL to scrape
 * @param  {Object}   model         Literal object describing the data to extracted from the given page
 * @param  {Object}   [options={}]  Aditional options for request and cheerio
 * @param  {Function} cb            Standard nodejs callback
 * @return {null}
 */

function scrape(url, model, options, cb) {

  /**
   * Make `options` argument optional
   */

  if ('function' === typeof options) {

    /**
     * Interchange `cb`'s position and fill `options` with nice defaults
     */

    cb = options;
    options = _.cloneDeep(DEFAULTS);

  } else {

    /**
     * Merge all options from `DEFAULTS` not present in `options`
     */

    _.defaultsDeep(options, DEFAULTS);

  }

  /**
   * Set `request`'s Uniform Resource Identifier to provied `url`
   * @type {string}
   */

  options.requestOptions.uri = url;

  /**
   * Call `request()` to get the resource
   */

  request(options.requestOptions, processResponse);

  /**
   * Handle `request()`'s result: Chain `err` or proceed to parse the resource.
   */

  function processResponse(err, res, body) {

    if (err) { return cb(err); }

    if (res.statusCode !== 200) {
      return cb(new Error({
        message: 'Not OK response from server.',
        response: res,
        body: body
      }));
    }

    parseBody(body, model, options, cb);

  }
}

/**
 * Parse the HTML in search of each item in `model`
 * @param  {string}   bodyString  HTML content
 * @param  {Object}   model       Data model
 * @param  {Object}   options     Item defaults
 * @param  {Function}   cb        Callback
 * @return {null}
 */

function parseBody(bodyString, model, options, cb) {

  var result = {};
  var dom;

  /**
   * Load the HTML and parse it with cheerio to create a DOM
   */

  try {
    dom = cheerio.load(bodyString, options.cheerioOptions);
  } catch (err) {
    err.bodyString = bodyString;
    return cb(err);
  }

  for (var item in model) {

    result[item] = getItem(dom, model[item], options.itemOptions);

    /**
     * If an item produces an `Error`, chain the error to `cb`
     * e.g. when `required` is set to `true` and the element does't exists
     *
     * It will attach the body string to the `Error` object
     */

    if (result[item] instanceof Error) {
      result[item].bodyString = bodyString;
      return cb(result[item]);
    }

  }

  return cb(null, result);

}

/**
 * Given a `dom`, traverse it to get the desired item
 * @param  {Object}           dom       cheerio object
 * @param  {(string|object)}  item      Can be a string holding the `selector` or an Object with multiple options, including `selector`
 * @param  {Object}           defaults  Default options tha fullfill `item`'s unset options
 * @return {string|string[]|Error}      Returns a string or an array of strings with the result... or Error
 */

function getItem(dom, item, defaults) {

  var data;
  var get;
  var nodes;
  var selector;

  /**
   * If the `item` itself is a selector, grab it as `selector` and set item to
   * a new empty object, otherwise, the `selector` must be inside `item`.
   */

  if ('string' === typeof item) {
    selector = item;
    item = {};
  } else {
    selector = item.selector;
  }

  /**
   * Then fulfill the `item` with nice `defaults`.
   */

  _.defaultsDeep(item, defaults);

  /**
   * This is an array of cheerio objects. Always an array.
   * @type {Object}
   */

  nodes = dom(selector);

  /**
   * If there are no matches for the given `selector` set the result as `null`
   * Ohterwise, proceed to process the result.
   */

  if (!nodes.length) {

    data = null;

  } else {

    data = [];

    /**
     * The text of a node is what you probably are looking for. Scraping is all
     * about content.
     * Cheerio has the `.text()` method to get it, this is the default.
     * If you are looking for something else, it must be an attribute, like a
     * link's `href` or an image/script's `src` or a form's `method`.
     * @type {Function}
     */

    get = (item.get === 'text')
      ? function(node) { return item.prefix + node.text() + item.suffix; }
      : function(node) { return item.prefix + node.attr(item.get) + item.suffix; };

    for (var i = nodes.length - 1; i >= 0; i--) {
      data[i] = get(nodes.eq(i));
    }

    switch (item.multi) {
      case true:
        break;
      case false:
        data = data[0];
        break;
      case 'auto':
        if (nodes.length === 1) {
          data = data[0];
        }
        break;
    }
  }

  if (!data && item.required) {
    return new Error({
      message: 'Item [' + selector + '] set as REQUIRED and NOT found'
    });
  }

  return data;

}