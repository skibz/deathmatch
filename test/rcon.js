
var chai = require('chai');
var expect = chai.expect;

var Rcon = require('../app/pickups/rcon');

describe('rcon class', function() {

  it('should have a prototype', function() {
    expect(Rcon.prototype).to.be.an.instanceof(Object);
  });

  it('should have a create function', function() {
    expect(Rcon.create).to.be.an.instanceof(Function);
  });

  describe('rcon instance', function() {

    it('should have instance properties', function() {
      var rcon = Rcon.create();
      expect(rcon._commands).to.be.an.instanceof(Array);
      expect(rcon._commands).to.be.empty;
    });

    it('should have instance functions', function() {
      var rcon = Rcon.create();
      expect(rcon.map).to.be.an.instanceof(Function);
      expect(rcon.say).to.be.an.instanceof(Function);
      expect(rcon.kick).to.be.an.instanceof(Function);
      expect(rcon.ban).to.be.an.instanceof(Function);
      expect(rcon.unban).to.be.an.instanceof(Function);
      expect(rcon.go).to.be.an.instanceof(Function);
    });

    describe('fluent api', function() {
      describe('map', function() {
        it('should return itself', function() {
          var rcon = Rcon.create();
          expect(rcon.map('cp_badlands')).to.deep.equal(rcon);
        });
        it('should append a string element to the _commands array', function() {
          var rcon = Rcon.create();
          expect(rcon._commands.length).to.equal(0);
          rcon.map('cp_badlands');
          expect(rcon._commands.length).to.equal(1);
        });
      });
      describe('say', function() {
        it('should return itself', function() {
          var rcon = Rcon.create();
          expect(rcon.say('hello everyone')).to.deep.equal(rcon);
        });
        it('should append a string element to the _commands array', function() {
          var rcon = Rcon.create();
          expect(rcon._commands.length).to.equal(0);
          rcon.say('hello everyone');
          expect(rcon._commands.length).to.equal(1);
        });
      });
      describe('kick', function() {
        it('should return itself', function() {
          var rcon = Rcon.create();
          expect(rcon.kick('zoidberg')).to.deep.equal(rcon);
        });
        it('should append a string element to the _commands array', function() {
          var rcon = Rcon.create();
          expect(rcon._commands.length).to.equal(0);
          rcon.kick('zoidberg');
          expect(rcon._commands.length).to.equal(1);
        });
      });
      describe('ban', function() {
        it('should return itself', function() {
          var rcon = Rcon.create();
          expect(rcon.ban('zoidberg')).to.deep.equal(rcon);
        });
        it('should append a string element to the _commands array', function() {
          var rcon = Rcon.create();
          expect(rcon._commands.length).to.equal(0);
          rcon.ban('zoidberg');
          expect(rcon._commands.length).to.equal(1);
        });
      });
      describe('unban', function() {
        it('should return itself', function() {
          var rcon = Rcon.create();
          expect(rcon.unban('zoidberg')).to.deep.equal(rcon);
        });
        it('should append a string element to the _commands array', function() {
          var rcon = Rcon.create();
          expect(rcon._commands.length).to.equal(0);
          rcon.unban('zoidberg');
          expect(rcon._commands.length).to.equal(1);
        });
      });
    });

    describe('go', function() {
      it('should throw if no host, port and/or password are given', function() {
        expect(Rcon.create().map('123').go).to.throw(TypeError);

        expect(Rcon.create({host: 'localhost', port: 27000}).map('123').go).to.throw(TypeError);
        expect(Rcon.create({port: 27000, rcon: 'abc123'}).map('123').go).to.throw(TypeError);
        expect(Rcon.create({host: 'localhost', rcon: 'abc123'}).map('123').go).to.throw(TypeError);

        expect(Rcon.create({host: 'localhost'}).map('123').go).to.throw(TypeError);
        expect(Rcon.create({port: 27000}).map('123').go).to.throw(TypeError);
        expect(Rcon.create({rcon: 'abc123'}).map('123').go).to.throw(TypeError);
      });
      it('should throw if simple-rcon emits an error', function() {
        expect(Rcon.create({host: 'localhost', port: 27000, rcon: 'abc123'}).go).to.throw(Error);
      });
    });
  });

});
