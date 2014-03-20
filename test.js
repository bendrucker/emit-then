'use strict';

/* globals describe:false, beforeEach:false, it:false, expect:false, sinon:false */

require('test-setup');

var EventEmitter = require('events').EventEmitter;
var Promise      = require('bluebird');
var emitThen     = require('./');

describe('emitThen', function () {

  var emitter;
  beforeEach(function () {
    emitter = new EventEmitter();
    emitter.emitThen = emitThen;
  });

  var deferred;
  beforeEach(function () {
    deferred = Promise.defer();
    emitter.on('event', function () {
      return deferred.promise;
    });
  });

  var error;
  beforeEach(function () {
    error = new Error('A wild error appeared');
  });

  var spy;
  beforeEach(function () {
    spy = sinon.spy();
  });

  it('resolves when the handlers resolve', function () {
    process.nextTick(deferred.resolve.bind(deferred));
    return emitter.emitThen('event');
  });

  it('rejects when a handler rejects', function () {
    process.nextTick(deferred.reject.bind(deferred, error));
    return expect(emitter.emitThen('event'))
      .to.be.rejectedWith(error);
  });

  it('rejects when a handler throws', function () {
    deferred.resolve();
    emitter.on('event', function () {
      throw error;
    });
    return expect(emitter.emitThen('event'))
      .to.be.rejectedWith(error);
  });

  it('preserves the context for the handlers', function () {
    deferred.resolve();
    emitter.on('event', spy);
    return emitter.emitThen('event').finally(function () {
      expect(spy).to.have.been.calledOn(emitter);
    });
  });

  it('preserves the arguments for the handlers', function () {
    deferred.resolve();
    emitter.on('event', spy);
    return emitter.emitThen('event', 'foo', 'bar').finally(function () {
      expect(spy).to.have.been.calledWith('foo', 'bar');
    });
  });

  it('can register itself on the native emitter prototype', function () {
    emitThen.register();
    expect(EventEmitter).to.respondTo('emitThen');
  });

});