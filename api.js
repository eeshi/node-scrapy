var request = require('request');
var cheerio = require('cheerio');
var DEFAULTS = require('./defaults.json')
var api = {};

api.scrap = scrap;
module.exports = api;


function scrap(url, model, options, callback) {

  var reqOptions = DEFAULTS.requestOptions;

  reqOptions = mergeOptions(options, reqOptions);

  reqOptions.uri = url;

  getBody(reqOptions, function(err, data) {

    if (err) {
      return callback(err);
    }

    parseBody(data.body, model, function(err, data) {

      if (err) {
        return callback(err);
      }

      return callback(null, data);  

    });
  });
};


function getBody(options, callback) {

  var data = {};

  request(options, function(err, res, body) {

    if (err) {
      return callback(err);
    }

    if (res.statusCode === 200) {

      data.res = res;
      data.body = body;

      return callback(null, data);

    }

    return callback(new Error('NOT OK response.').stack);

  });
}

function parseBody(body, model, callback) {

  var parsedItems = {};

  try {
    var $ = cheerio.load(body);
  } catch (err) {
    return callback(err);
  }

  for (var item in model) {
    getItem($, model[item], function(err, data){

      if (err) {
        return callback(err);
      }

      parseItem($, data, model[item], function(err, data){

        if (err) {
          return callback(err);
        }

        parsedItems[item] = data;

      });

    });
  }

  return callback(null, parsedItems);

}

function getItem($, query, callback) {

  var result;
  var selector;

  if (typeof query === 'string') {
    selector = query;
  } else if (typeof query === 'object') {
    selector = query.selector;
  }

  result = $(selector);

  return callback(null, result);

}

function parseItem($, item, options, callback) {

  var data = {};
  var objLength = item.length;
  var itemOptions = DEFAULTS.itemOptions;

  if (typeof options === 'object') {
    itemOptions = mergeOptions(options, itemOptions);
  } else {
    itemOptions.selector = options;
  }

  switch (objLength) {
    case 0:
      data = null;
      break;
    case 1:
      data = item.eq(0);
      break;
    default:
      data = item.map(function() {
        return $(this);
      });
      break;
  }

  if (!data && itemOptions['required']) {
    return callback(new Error('Item set as REQUIRED and NOT found').stack);
  }

  return callback(null, data);

}


function mergeOptions(from, to) {

  for (var attr in from) {
    to[attr] = from[attr];
  }

  return to;
}