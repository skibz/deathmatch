
var chai = require('chai');
var expect = chai.expect;

var objectry = require('../app/core/objectry');

describe('objectry', function() {

  it('should return a blank object if no options are passed', function() {
    expect(objectry()).to.deep.equal({});
  });

  it('should return an object with keys prefixed by an underscore containing value, writable, configurable and enumerable properties', function() {
    var prefixed = objectry({test: 'a', test2: 'b'});
    expect(prefixed).to.have.keys(['_test', '_test2']);
    expect(prefixed._test).to.deep.equal({
      value: 'a',
      writable: true,
      configurable: true,
      enumerable: true
    });
    expect(prefixed._test2).to.deep.equal({
      value: 'b',
      writable: true,
      configurable: true,
      enumerable: true
    });
  });
});
