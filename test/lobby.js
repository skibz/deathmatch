
'use strict';

var chai = require('chai');
var expect = chai.expect;

var Lobby = require('../app/core/lobby/lobby');

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
      expect(lobby._starting).to.equal(false);
      expect(lobby._starter).to.be.null;

      describe('defaults', function() {
        var lobby = Lobby.create({});
        it('should initialise with default instance properties if no options are given', function() {
          expect(lobby._players).to.deep.equal({});
          expect(lobby._map).to.equal('cp_badlands');
          expect(lobby._format).to.equal(6);
        });
      });
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

    describe('properties and functions', function() {
      describe('_players', function() {
        var lobby = Lobby.create();
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
      });
      describe('isAdded()', function() {
        var lobby = Lobby.create({players: {abcd: 'abcd'}});
        it('should contain a property after initialisation', function() {
          expect(lobby.isAdded('abcd')).to.equal(true);
        });
        it('should return false for a non existent property', function() {
          expect(lobby.isAdded('lkjasdflksdabcd')).to.equal(false);
        });
      });
      describe('isFull()', function() {
        var lobby = Lobby.create({format: 2});
        it('should return false if the number of player properties is less than twice the value of _format', function() {
          expect(lobby.isFull()).to.equal(false);
        });
        it('should return true if the number of player properties is twice the value of _format', function() {
          lobby.add('1');
          lobby.add('2');
          lobby.add('3');
          lobby.add('4');
          expect(lobby.isFull()).to.equal(true);
        });
      });
      describe('_map', function() {
        var lobby = Lobby.create();
        it('should change after map() is invoked', function() {
          lobby.map('def');
          expect(lobby.map()).to.equal('def');
        });
      });
      describe('_format', function() {
        var lobby = Lobby.create({format: 2});
        it('should change after format() is invoked', function() {
          lobby.format(5);
          expect(lobby.format()).to.equal(10);
        });
      });
      describe('_timeout', function() {
        var lobby = Lobby.create({timeout: 100});
        it('should be equal to the given value if provided at construction time', function() {
          expect(lobby._timeout).to.equal(100);
        });
      });
      describe('_starting', function() {
        it('should be false until total players is equal to double the value of _format', function() {
          var lobby = Lobby.create({format: 2});
          lobby.add('1');
          expect(lobby._starting).to.equal(false);
          lobby.add('2');
          expect(lobby._starting).to.equal(false);
          lobby.add('3');
          expect(lobby._starting).to.equal(false);
          lobby.add('4');
          expect(lobby._starting).to.equal(true);
        });
        it('should remain true if total players becomes less than double the value of _format after becoming double the value of _format', function() {
          var lobby = Lobby.create({format: 2});
          lobby.add('1');
          expect(lobby._starting).to.equal(false);
          lobby.add('2');
          expect(lobby._starting).to.equal(false);
          lobby.add('3');
          expect(lobby._starting).to.equal(false);
          lobby.add('4');
          expect(lobby._starting).to.equal(true);
          lobby.rem('4');
          lobby.rem('2');
          lobby.add('a');
          expect(lobby._starting).to.equal(true);
        });
      });
      describe('_starter', function() {
        it('should be null until total players is equal to double the value of _format', function() {
          var lobby = Lobby.create({format: 2});
          expect(lobby._starter).to.equal(null);
          lobby.add('1');
          expect(lobby._starter).to.equal(null);
          lobby.add('2');
          expect(lobby._starter).to.equal(null);
          lobby.add('3');
          expect(lobby._starter).to.equal(null);
          lobby.add('4');
          expect(lobby._starter).to.be.an.instanceof(Object);
        });
      });
      describe('_started', function() {
        it('should be invoked after _timeout milliseconds once total players is equal to double the value of _format', function(done) {
          var lobby = Lobby.create({
            format: 1,
            timeout: 10,
            started: done
          });
          lobby.add('1');
          // expect(lobby._starter).to.equal(null);
          lobby.add('2');
          // expect(lobby._starter).to.not.equal(null);
        });
        it('should reset the object back to default state after the _started callback has been invoked', function(done) {
          var lobby = Lobby.create({
            format: 1,
            timeout: 10,
            started: function() {
              expect(lobby._starter).to.be.null;
              expect(lobby._starting).to.equal(false);
              expect(lobby._players).to.deep.equal({});
              return done();
            }
          });
          lobby.add('1');
          // expect(lobby._starter).to.equal(null);
          lobby.add('2');
          // expect(lobby._starter).to.not.equal(null);
        });
      });
      describe('_postponed', function() {
        it('should be invoked after _timeout milliseconds once total players is equal to double the value of _format and subsequently becomes less than double the value of _format', function(done) {
          var lobby = Lobby.create({
            format: 1,
            timeout: 10,
            postponed: done
          });
          lobby.add('1');
          // expect(lobby._starter).to.equal(null);
          lobby.add('2');
          // expect(lobby._starter).to.not.equal(null);
          lobby.rem('2');
          // expect(lobby._starter).to.be.null;
        });
      });

      describe('#add', function() {
        it('should execute a given callback when add is invoked', function(done) {
          var lobby = Lobby.create({
            format: 1,
            timeout: 10
          });
          lobby.add('abc', function(added) {
            done();
          });
        });
      });
      describe('#rem', function() {
        it('should execute a given callback when rem is invoked', function(done) {
          var lobby = Lobby.create({
            format: 1,
            timeout: 10
          });
          lobby.add('abc');
          lobby.rem('abc', function(removed) {
            done();
          });
        });
      });
    });
  });
});
