/**
 * Module dependencies
 */

var request = require('request');
var cheerio = require('cheerio');
var _ = require('./lodash.custom.js');

/**
 * A bunch of handy defaults.
 * @type { Object }
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
 * @param { Object } destination  The destination object
 * @param { Object } source       The source object
 *
 * @return { Object }             The `destination` object with new properties
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
 * @param  {String}   url           Valid URL to scrape
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
   * @type {String}
   */

  options.requestOptions.uri = url;


  request(options.requestOptions, processResponse);

  function processResponse(err, res, body) {

    if (err) { return cb(err); }

    if (res.statusCode !== 200) {
      return cb(new Error({
        message: 'Not OK response from server.',
        response: res,
        body: body
      }));
    }

    parseBody(body, model, options, onParseBody);
  }

  function onParseBody(err, data) {

    if (err) { return cb(err); }

    return cb(null, data);

  }
}

function parseBody(body, model, options, cb) {

  var result = {};
  var err;
  var dom;

  try {
    dom = cheerio.load(body, options.cheerioOptions);
  } catch (err) {
    return cb(err);
  }

  for (var item in model) {
    result[item] = getItem(dom, model[item], options.itemOptions, chainError);
  }

  function chainError(error) {
    err = error;
  }

  if (err) { return cb(err); }

  return cb(null, result);

}


function getItem(dom, item, defaults, callOnError) {

  var data;
  var get;
  var nodes;
  var selector;

  if ('string' === typeof item) {
    selector = item;
    item = {};
  } else {
    selector = item.selector;
  }

  _.defaultsDeep(item, defaults);

  nodes = dom(selector);

  if (!nodes.length) {
    data = null;
  } else {
    data = [];

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
    return callOnError(new Error({
      message: 'Item [' + selector + '] set as REQUIRED and NOT found'
    }));
  }

  return data;

}