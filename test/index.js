
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var expect = chai.expect;

var Lobby = require('../app/pickups/lobby');
var prefixer = require('../app/etc/prefixer');

describe('lobby class', function() {

  it('should have a prototype', function() {
    expect(Lobby.prototype).to.be.an.instanceof(Object);
  });

  it('should have a create function', function() {
    expect(Lobby.create).to.be.an.instanceof(Function);
  });

  describe('lobby instance', function() {

    it('should have instance properties', function() {
      var lobby = Lobby.create({
        players: {},
        map: 'abc',
        format: 2
      });
      expect(lobby._players).to.deep.equal({});
      expect(lobby._map).to.equal('abc');
      expect(lobby._format).to.equal(2);
      expect(lobby._timeout).to.be.greaterThan(0);
      expect(lobby._finalising).to.equal(false);
      expect(lobby._finaliser).to.be.null;
      expect(lobby._createdAt).to.be.greaterThan(0);
    });

    it('should have instance functions', function() {
      var lobby = Lobby.create({
        players: {},
        map: 'abc',
        format: 2
      });
      expect(lobby.add).to.be.an.instanceof(Function);
      expect(lobby.rem).to.be.an.instanceof(Function);
      expect(lobby.isAdded).to.be.an.instanceof(Function);
      expect(lobby.map).to.be.an.instanceof(Function);
      expect(lobby.format).to.be.an.instanceof(Function);
      expect(lobby.players).to.be.an.instanceof(Function);
      expect(lobby.isFull).to.be.an.instanceof(Function);
    });

    describe('properties', function() {
      describe('_players', function() {
        var lobby = Lobby.create({
          players: {},
          map: 'abc',
          format: 2
        });
        it('should be empty after initialisation', function() {
          expect(lobby._players).to.deep.equal({});
        });
        it('should contain a property after add() is invoked', function() {
          lobby.add('abc');
          expect(lobby.players()).to.contain('abc');
        });
        it('should not contain a property after rem() is invoked', function() {
          lobby.rem('abc');
          expect(lobby.players()).to.not.contain('abc');
        });

        describe('isAdded()', function() {
          var lobby = Lobby.create({
            players: {abcd: 'abcd'},
            map: 'abc',
            format: 2
          });
          it('should contain a property after initialisation', function() {
            expect(lobby.isAdded('abcd')).to.equal(true);
          });
          it('should return false for a non existent property', function() {
            expect(lobby.isAdded('lkjasdflksdabcd')).to.equal(false);
          });

          describe('isFull()', function() {
            var lobby = Lobby.create({
              players: {abcd: 'abcd'},
              map: 'abc',
              format: 2
            });
            it('should return false if the number of player properties is less than twice the value of _format', function() {
              expect(lobby.isFull()).to.equal(false);
            });
          });
        });
      });
      describe('_map', function() {
        var lobby = Lobby.create({
          players: {},
          map: 'abc',
          format: 2
        });
        it('should change after map() is invoked', function() {
          lobby.map('def');
          expect(lobby.map()).to.equal('def');
        });
      });
      describe('_format', function() {
        var lobby = Lobby.create({
          players: {},
          map: 'abc',
          format: 2
        });
        it('should change after format() is invoked', function() {
          lobby.format(5);
          expect(lobby.format()).to.equal(10);
        });
      });
      describe('_timeout', function() {
        var lobby = Lobby.create({
          players: {},
          map: 'abc',
          format: 2,
          timeout: 100
        });
        it('should be equal to the given value if provided at construction time', function() {
          expect(lobby._timeout).to.equal(100);
        });
      });
      describe('_finalising', function() {
        it('should be false until total players is equal to double the value of _format', function() {
          var lobby = Lobby.create({
            players: {},
            map: 'abc',
            format: 2,
            timeout: 100
          });
          lobby.add('1');
          expect(lobby._finalising).to.equal(false);
          lobby.add('2');
          expect(lobby._finalising).to.equal(false);
          lobby.add('3');
          expect(lobby._finalising).to.equal(false);
          lobby.add('4');
          expect(lobby._finalising).to.equal(true);
        });
        it('should remain true if total players becomes less than double the value of _format after becoming double the value of _format', function() {
          var lobby = Lobby.create({
            players: {},
            map: 'abc',
            format: 2,
            timeout: 100
          });
          lobby.add('1');
          expect(lobby._finalising).to.equal(false);
          lobby.add('2');
          expect(lobby._finalising).to.equal(false);
          lobby.add('3');
          expect(lobby._finalising).to.equal(false);
          lobby.add('4');
          expect(lobby._finalising).to.equal(true);
          lobby.rem('4');
          lobby.rem('2');
          lobby.add('a');
          expect(lobby._finalising).to.equal(true);
        });
      });
      describe('_finaliser', function() {
        it('should be null until total players is equal to double the value of _format', function() {
          var lobby = Lobby.create({
            players: {},
            map: 'abc',
            format: 2,
            timeout: 100,
            afterTimeout: function() {}
          });
          expect(lobby._finaliser).to.equal(null);
          lobby.add('1');
          expect(lobby._finaliser).to.equal(null);
          lobby.add('2');
          expect(lobby._finaliser).to.equal(null);
          lobby.add('3');
          expect(lobby._finaliser).to.equal(null);
          lobby.add('4');
          expect(lobby._finaliser).to.be.an.instanceof(Object);
        });
      });
      describe('_afterTimeout', function() {
        it('should be invoked after _timeout milliseconds once total players is equal to double the value of _format', function(done) {
          // this test case could be a little dicey...
          //
          // i'm passing the done callback into `afterTimeout`
          // which will cause the test to fail if it's never
          // invoked.
          //
          var lobby = Lobby.create({
            players: {},
            map: 'abc',
            format: 1,
            timeout: 25,
            afterTimeout: done
          });
          expect(lobby._afterTimeout).to.be.an.instanceof(Function);
          lobby.add('1');
          expect(lobby._finaliser).to.equal(null);
          lobby.add('2');
          expect(lobby._finaliser).to.not.equal(null);
        });
      });
    });
  });
});

describe('prefixer', function() {

  it('should return an object with keys prefixed by an underscore containing value, writable, configurable and enumerable properties', function() {
    var prefixed = prefixer({test: 'a', test2: 'b'});
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
