
module.exports = function(options) {
  var properties, key;

  if (!(options && Object.keys(options).length)) {
    return {};
  }

  properties = {};

  for (key in options) {
    properties['_' + key] = {
      value: options[key],
      writable: true,
      enumerable: true,
      configurable: true
    };
  }

  return properties;
};
