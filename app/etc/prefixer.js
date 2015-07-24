
module.exports = function(options) {
  var properties = {};
  var keys = Object.keys(options), key, prefixed;

  for (key in keys) {
    prefixed = '_' + keys[key];
    properties[prefixed] = {};
    properties[prefixed].value = options[keys[key]];
    properties[prefixed].writable = true;
    properties[prefixed].enumerable = true;
    properties[prefixed].configurable = true;
  }

  return properties;
};
