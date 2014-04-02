var request = require('request');
var cheerio = require('cheerio');
var api = {};

module.exports = api;

api.scrap = function(url, model, options, callback) {

  var err = null;
  var data = {};

  if (err) {
    return callback(err);
  }

  return callback(null, data)

};