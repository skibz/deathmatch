
var chai = require('chai');
var expect = chai.expect;

var prefixer = require('../app/etc/prefixer');

describe('prefixer', function() {

  it('should return a blank object if no options are passed', function() {
    expect(prefixer()).to.deep.equal({});
  });

  it('should return an object with keys prefixed by an underscore containing value, writable, configurable and enumerable properties', function() {
    var prefixed = prefixer({test: 'a', test2: 'b'});
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
