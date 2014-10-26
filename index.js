var request = require('request');
var cheerio = require('cheerio');
var utils = require('./utils.js');
var DEFAULTS = require('./defaults.json')
var api = {};

api.scrape = scrape;
module.exports = api;


function scrape(url, model, options, cb) {

  var reqOptions = utils.clone(DEFAULTS.requestOptions);

  if (typeof options.requestOptions !== 'undefined') {
    reqOptions = utils.mergeOptions(options.requestOptions, reqOptions);
  }

  reqOptions.uri = url;

  getBody(reqOptions, function(err, data) {

    if (err) {
      return cb(err);
    }

    parseBody(data.body, model, onParseBody);

  });

  function onParseBody(err, data) {

    if (err) {
      return cb(err);
    }

    return cb(null, data);

  }
};


function getBody(options, cb) {

  var data = {};

  request(options, function(err, res, body) {

    if (err) {
      return cb(err);
    }

    if (res.statusCode === 200) {

      data.res = res;
      data.body = body;

      return cb(null, data);

    }

    return cb(new Error('NOT OK response.').stack);

  });
}

function parseBody(body, model, cb) {

  var parsedItems = {};
  var cheerioOptions = utils.clone(DEFAULTS.cheerioOptions);
  var $;

  try {
    $ = cheerio.load(body, cheerioOptions);
  } catch (err) {
    return cb(err);
  }

  for (var item in model) {

    getItem($, model[item], function(err, data) {

      if (err) {
        return cb(err);
      }

      parseItem(data, model[item], function(err, data){

        if (err) {
          return cb(err);
        }

        parsedItems[item] = data;

      });

    });
  }

  return cb(null, parsedItems);

}

function getItem($, query, cb) {

  var result;
  var selector;

  if (typeof query === 'string') {
    selector = query;
  } else if (typeof query === 'object') {
    selector = query.selector;
  }

  result = $(selector);

  return cb(null, result);

}

function parseItem(item, options, cb) {

  var data;
  var get;
  var objLength = item.length;
  var itemOptions = utils.clone(DEFAULTS.itemOptions);

  if (typeof options === 'object') {
    itemOptions = utils.mergeOptions(options, itemOptions);
  } else {
    itemOptions.selector = options;
  }

  if (objLength === 0) {
    data = null;
  } else {
    data = [];

    get = (itemOptions.get === 'text')
      ? function(item) { return itemOptions.prefix + item.text() + itemOptions.suffix; }
      : function(item) { return itemOptions.prefix + item.attr(itemOptions.get) + itemOptions.suffix; }

    for (var i = objLength - 1; i >= 0; i--) {
      data[i] = get(item.eq(i));
    }

    switch (itemOptions.multi) {
      case true:
        break;
      case false:
        data = data[0];
        break;
      case 'auto':
        if (objLength === 1) {
          data = data[0];
        }
        break;
    }
  }

  if (!data && itemOptions['required']) {
    return cb(new Error('Item [' + itemOptions.selector + '] set as REQUIRED and NOT found').stack);
  }

  return cb(null, data);

}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}
