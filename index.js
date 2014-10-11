'use strict';

var EventEmitter = require('events').EventEmitter;
var Promise      = require('bluebird');

function emitThen (event) {
  var args = Array.prototype.slice.call(arguments, 1);
  /* jshint validthis:true */
  return Promise
    .bind(this)
    .return(this)
    .call('listeners', event)
    .map(function (listener) {
      var a1 = args[0], a2 = args[1];
      switch (args.length) {
        case 0: return listener.call(this);
        case 1: return listener.call(this, a1)
        case 2: return listener.call(this, a1, a2);
        default: return listener.apply(this, args);
      }
    })
    .return(null);
}

emitThen.register = function () {
  EventEmitter.prototype.emitThen = emitThen;
};

module.exports = emitThen;