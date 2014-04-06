var clone = (function() {
  return function(obj) {
    Clone.prototype = obj;
    return new Clone();
  }
  function Clone() {};
})();


var mergeOptions = function(from, to) {

  for (var attr in from) {
    to[attr] = from[attr];
  }

  return to;
}

exports.clone = clone;
exports.mergeOptions = mergeOptions;