var request = require('request');
var cheerio = require('cheerio');
var api = {};

api.scrap = scrap;
module.exports = api;


function scrap(url, model, options, callback) {

  var reqOptions = {};

  if (typeof options.request != 'undefined') {
    reqOptions = options.request;
  }

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

    if (res.statusCode == 200) {

      data.res = res;
      data.body = body;

      return callback(null, data);

    } else {
      return callback({ msg: "NOT OK response.", res: res });
    }

  });
}

function parseBody(body, model, callback) {

  var err = null;
  var data = {};

  if (err) {
    return callback(err);
  }

  var $ = cheerio.load(body);


  return callback(null, data);

}