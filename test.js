'use strict';

/* globals describe:false, beforeEach:false, it:false */
/* jshint expr:true */

var chai         = require('chai');
var expect       = chai.expect;
var sinon        = require('sinon');
var EventEmitter = require('events').EventEmitter;
var emitThen     = require('./');

chai
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));

describe('emit-then', function () {

  var emitter, error, spy;
  beforeEach(function () {
    emitter = new EventEmitter();
    emitter.emitThen = emitThen;
    error = new Error('A wild error appeared');
    spy = sinon.spy();
  });

  it('resolves when the handlers resolve', function () {
    emitter.on('event', function () {
      return Promise.resolve();
    });
    return emitter.emitThen('event').then(function (value) {
      expect(value).to.be.null;
    });
  });

  it('rejects when a handler rejects', function () {
    emitter.on('event', function () {
      return Promise.reject(error);
    });
    return expect(emitter.emitThen('event'))
      .to.be.rejectedWith(error);
  });

  it('rejects when a handler throws', function () {
    emitter.on('event', function () {
      throw error;
    });
    return expect(emitter.emitThen('event'))
      .to.be.rejectedWith(error);
  });

  it('preserves the context for the handlers', function () {
    emitter.on('event', spy);
    return emitter.emitThen('event').catch().then(function () {
      expect(spy).to.have.been.calledOn(emitter);
    });
  });

  it('preserves the arguments for the handlers', function () {
    emitter.on('event', spy);
    return emitter.emitThen('event', 'foo', 'bar').catch().then(function () {
      expect(spy).to.have.been.calledWith('foo', 'bar');
    });
  });

  it('can register itself on the native emitter prototype', function () {
    emitThen.register();
    expect(EventEmitter).to.respondTo('emitThen');
  });

});
